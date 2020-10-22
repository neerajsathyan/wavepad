'use strict';

const version = 'v1.01';
const staticCachePrefix = 'wave-pd1-static-';
const cacheVersion = staticCachePrefix + version;

this.addEventListener('activate', function (event) {
    event.waitUntil(
        // Delete old cache
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.filter(function (key) {
                    return key != cacheVersion;
                }).map(function (key) {
                    return caches.delete(key);
                }));
        })
    );
});

this.addEventListener('fetch', function (event) {
    let originalResponse;

    event.respondWith(
        fetch(event.request.clone())
            .then(function (response) {
                // Check that the status is OK
                if (/^0|([123]\d\d)|(40[14567])|410$/.test(response.status)) {

                    return response.clone();
                }

                originalResponse = response;
                throw new Error('Bad response');
            })
            .catch(function (error) {
                throw new Error('No Network!');
            })
    );
});
