const version = '1.0.0'

self.addEventListener('install', event => {
  console.log(`SW: Installed version ${version}`)

  /**
   * When the serverworker is being installed - cache assets.
   *
   * @returns {Promise} A promise.
   */
  const cachedAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('SW: Caching files.')
    // Add static files to cache.
    return cache.addAll([
      'index.html',
      'css/styles.css'
    ])
  }
  // Wait until all files have been cached.
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

/**
 * Remove cached assets from old versions.
 *
 * @returns {undefined}
 */
const removeCahedAssets = async () => {
  const cacheNames = await caches.keys()

  return Promise.all(
    // Loop throuh all caches.
    // Check if name matches current version - if not delete cache.
    cacheNames.map(cache => {
      if (cache !== version) {
        console.log(`SW: Clearing cache ${cache}`)
        return caches.delete(cache)
      }
      return undefined
    })
  )
}

self.addEventListener('activate', event => {
  console.log(`SW: Activated version ${version}`)
  // Wait until all old caches are deleted.
  event.waitUntil(removeCahedAssets())
})
