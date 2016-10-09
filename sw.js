// This code is executed in a Worker context.
var FILES = [
  '/',
  '/index.html',
  '/app.css',
  '/app.js',
  '/sw.js'
];

var CACHE_KEY = 'v1';

// populateCache takes in a cache and populates the entirety of it with the given files array.
function populateCache (files, cache) {
  return cache.addAll(files);
};

// serveCachedContent takes the response from the cache and simply returns it.
function serveCachedContent (response) {
  // The response data could be transformed here.

  return response;
};

// requestFreshContent takes a FetchEvent and retrieves the online version.
function requestFreshContent(event) {
  return fetch(event.request).then(cacheFreshData.bind(this, event));
};

// cacheFreshData takes a FetchEvent and response data for a fetch() call and caches
// the response data in the cache.
function cacheFreshData (event, response) {
  return caches.open(CACHE_KEY).then(function (cache) {
    // Put a clone of the response into the cache.
    cache.put(event.request, response.clone());

    return response;
  });
};

// An install event fires when an install has successfully completed. The install event is
// generatally used to populate your browser's offline caching capabilities with the assets you need
// to run your app offline.
function onInstall (event) {
  event.waitUntil(
    caches.open(CACHE_KEY).then(populateCache.bind(this, FILES))
  );
};

// A fetch event fires every time any resource controlled
// by a service worker is fetched, which includes the documents
// inside the specified scope, and any resources referenced in
// those documents (for example if index.html makes a cross
// origin request to embed an image, that still goes through its service worker.)
function onFetch (event) {
  event.respondWith(
    // Match the request against the caches and if an error occurs (most likely the file is not cached)
    // we will use the new Fetch API to retrieve the fresh data.

    // The matching is done via url and vary headers, just like with normal HTTP requests.
    caches.match(event.request)
      .then(serveCachedContent)
      .catch(requestFreshContent.bind(this, event))
  );
};

this.addEventListener('install', onInstall);
this.addEventListener('fetch', onFetch);
