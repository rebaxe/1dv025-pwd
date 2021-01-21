const version = '1.0.0'

self.addEventListener('install', event => {
  console.log(`SW: Installed version ${version}`)

  /**
   * When the server is installet - cache assets.
   *
   * @returns {Promise} A promise.
   */
  const cachedAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('SW: Caching files.')

    return cache.addAll([
      'index.html',
      'css/styles.css'
    ])
  }
  event.waitUntil(cachedAssets())
})

/**
 * Add resources to cache storage on fetch or get response from cache storage.
 *
 * @param {Request} request The request sent from the client.
 * @returns {Response} A response to the request.
 */
const cachedFetch = async request => {
  // Try to fetch asset from server.
  try {
    const response = await fetch(request)
    const cache = await caches.open(version)
    // Save request together with cloned response to cache storage.
    cache.put(request, response.clone())
    return response
    // If not possible to fetch asset from server - serve cached matching result
  } catch (error) {
    console.log('SW: Serving cached result.')
    return caches.match(request)
  }
}

// Listen for fetch and serve response to client.
self.addEventListener('fetch', event => {
  console.log('SW: Fetching.')
  event.respondWith(cachedFetch(event.request))
})
