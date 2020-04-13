(function (global, self) {
    "use strict";
  
    var REQUEST_CACHE = 'request-cache';
  
    async function fetchWithCredentialsAsync(request) {
      if (request.mode === 'navigate') {
        return fetch(request);
      }
      return fetch(request, { credentials: 'same-origin' });
    }
  
    async function installAsync() {
      var files = [
        "Index.html",
        "Page2.html",
        "scripts/jquery.js",
      ];
      let cache = await caches.open(REQUEST_CACHE);
      let existingCacheRecords = await cache.keys();
      let resourcesToSync = files.filter(x => existingCacheRecords.indexOf(x) === -1);
      let cachePromises = resourcesToSync.map(async function (request) {
              // ignore the normal http cache when fetching this
              let response = await fetchWithCredentialsAsync(request);
              await cache.put(request, response);
      });
      return await Promise.all(cachePromises);
    }
  
    self.addEventListener('install', function (event) {
      // do stuff for the install here
      self.skipWaiting();
      event.waitUntil(installAsync());
    });
  
    self.addEventListener('activate', function (event) {
      // check if there is a version update, 
      // if so 
    });
  
    self.addEventListener('fetch', function (event) {
      event.respondWith(
        caches.match(event.request)
        .then(function (response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          return fetch(event.request);
        })
      );
    });
  })(this, this.self);