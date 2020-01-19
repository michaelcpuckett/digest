const CACHE_NAME = 'platinum-v1'

const urlsToCache = [
  '/',
  '/base.css',
  '/app.js',
  '/platinum.js',
  '/hnCard.js'
]

self.addEventListener('install', event => {
  event.waitUntil(() => {
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  })
})

updateCache = (request, clientId) => {
  fetch(request)
    .then(response => {
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, response.clone())
        clients.get(clientId).then(async client => {
          await (response.clone().json()).then(async result => {
            client.postMessage({
              type: 'UPDATE_CACHE',
              url: request.url,
              result
            })
          })
        })
      })
    })
}

self.addEventListener('fetch', event => {
  event.respondWith(
    event.request.url.includes('?cache=false') ?
      fetch(event.request) :
      caches.match(event.request)
        .then(response => {
          if (response) {
            if (response.type !== 'basic') {
              setTimeout(() => {
                updateCache(event.request, event.clientId)
              }, 0)
            }
            return response.clone()
          }
          return fetch(event.request)
            .then(response => {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()))
              return response.clone()
            })
        }
      )
  );
});