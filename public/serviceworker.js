const CACHE_NAME = 'platinum-v1'

const urlsToCache = [
  '/base.css',
  '/app.js',
  '/app.html',
  '/platinum/Element.js',
  '/platinum/For.js',
  '/platinum/If.js',
  '/platinum/Shadow.js',
  '/platinum/index.js',
  '/components/card/hn/index.js',
  '/components/card/hn/template.html',
  '/components/list/hn/index.js',
  '/components/list/hn/template.html',
  '/components/card/headline/index.js',
  '/components/card/headline/template.html',
  '/components/list/headline/index.js',
  '/components/list/headline/template.html',
  '/components/embed/index.js',
  '/components/embed/template.html',
  'https://fonts.googleapis.com/css?family=Kanit:300,800|Lato&display=swap'
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

const broadcast = async message => {
  const clients = await clients.matchAll()
  clients.forEach(client => {
    client.postMessage(message)
  })
}

const emit = async (client, message) => {
  client.postMessage(message)
}

updateCache = (url, target, clientId) => {
  fetch(url)
    .then(response => {
      caches.open(CACHE_NAME).then(cache => {
        cache.put(url, response.clone())
        clients.get(clientId).then(async client => {
          if (client) {
            await (response.clone().json()).then(async result => {
              emit(client, {
                type: 'UPDATE_CACHE',
                url: target,
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
      case (target.startsWith('https://hn/stories/')): {
        return `${target.replace('https://hn/stories/', 'https://hacker-news.firebaseio.com/v0/')}.json`
      }
      case (target.startsWith('https://hn/story/')): {
        return `${target.replace('https://hn/story/', 'https://hacker-news.firebaseio.com/v0/item/')}.json`
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
            updateCache(url, target, event.clientId)
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