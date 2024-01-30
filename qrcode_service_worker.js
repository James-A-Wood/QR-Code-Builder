
const filesToCache = [];
const staticCacheName = "v6";

self.addEventListener("install", event => {
    event.waitUntil( // extending the installing stage until the promise is resolved
        caches.open(staticCacheName).then(cache => cache.addAll(filesToCache))
    );
});

// serving cached assets, else retrieving from server
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).then(response => {
                // TODO - Respond with custom 404 page
                return caches.open(staticCacheName).then(cache => {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            });
        }).catch(error => {
            // Respond with custom offline page
        })
    );
});

// deleting old caches when a new service worker is activated
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => key !== staticCacheName && caches.delete(key))
        ))
    );
});




