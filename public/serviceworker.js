const CACHE_NAME = 'platinum-v1'

const urlsToCache = [
  '/base.css',
  '/app.js',
  '/app.html',
  '/platinum.js',
  '/components/card/hn/index.js',
  '/components/card/hn/template.html',
  '/components/list/hn/index.js',
  '/components/list/hn/template.html',
  '/components/embed/index.js',
  '/components/embed/template.html'
]

self.addEventListener('install', async event => {
  console.log('install')
  event.waitUntil(async function() {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(urlsToCache)
    await cache.put('/', (await cache.match('/app.html')))
    await Promise.all(urlsToCache.filter(url => url.startsWith('/components/') && url.endsWith('/index.js')).map(async url => {
      const templateUrl = url.replace('index.js', 'template.html')
      const templateResponse = await cache.match(templateUrl)
      const templateBody = await templateResponse.text()
      const response = await cache.match(url)
      const body = (await response.text()).replace(`import('./template.html')`, `
        \`
          ${templateBody}
        \`
      `)
      await cache.put(url, new Response(body, { headers: { 'Content-Type': 'text/javascript' } }))
    }))
  }())
})

self.addEventListener('message', async ({ data }) => {
  if (data.type === 'UPDATE_SCROLL_POSITION') {
    const cache = await caches.open(CACHE_NAME)
    cache.put('/ui/scrollPosition', new Response(JSON.stringify({ x: data.x, y: data.y }), { headers: { 'Content-Type': 'text/javascript' } }))
  }
})

updateCache = (request, clientId) => {
  fetch(request)
    .then(response => {
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, response.clone())
        clients.get(clientId).then(async client => {
          if (client) {
            await (response.clone().json()).then(async result => {
              client.postMessage({
                type: 'UPDATE_CACHE',
                url: request.url,
                result
              })
            })
          }
        })
      })
    })
}

self.addEventListener('fetch', event => {
  let {
    request: { url: target }
  } = event
  const url = (() => {
    switch(true) {
      case (target.startsWith('http://hn/stories/')): {
        return `${target.replace('http://hn/stories/', 'https://hacker-news.firebaseio.com/v0/')}.json`
      }
      case (target.startsWith('http://hn/story/')): {
        return `${target.replace('http://hn/story/', 'https://hacker-news.firebaseio.com/v0/item/')}.json`
      }
      default: {
        return target
      }
    }
  })()
  event.respondWith(
    caches.match(url)
      .then(response => {
        if (response) {
          if (response.headers.get('Content-Type').startsWith('application/json')) {
            updateCache(url, event.clientId)
          }
          return response
        }
        return fetch(url)
          .then(response => {
            caches.open(CACHE_NAME).then(cache => cache.put(url, response.clone()))
            return response.clone()
          })
      }
    )
  )
})