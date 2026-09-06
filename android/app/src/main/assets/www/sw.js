/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "6776ffd11f74722984ce03175f781bf2"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f53dc1268d3541cdcf054358b9b2f2a8"
  }, {
    "url": "pwa-192x192.png",
    "revision": "8080b3f44428f5f71d10a0fd88038976"
  }, {
    "url": "index.html",
    "revision": "54d8b6fbbb93073c2ccf27bae12b0ec7"
  }, {
    "url": "icon.svg",
    "revision": "140fb2b06d37186d763db64441e8f908"
  }, {
    "url": "favicon.png",
    "revision": "6743aa609b47901bce6919fddd751ce2"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "15b13fe941bb7aaf2a477ec0d474fe57"
  }, {
    "url": "assets/workbox-window.prod.es5-BBnX5xw4.js",
    "revision": null
  }, {
    "url": "assets/index-lYrtxJod.js",
    "revision": null
  }, {
    "url": "assets/index-DDwphgiy.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "15b13fe941bb7aaf2a477ec0d474fe57"
  }, {
    "url": "favicon.png",
    "revision": "6743aa609b47901bce6919fddd751ce2"
  }, {
    "url": "icon.svg",
    "revision": "140fb2b06d37186d763db64441e8f908"
  }, {
    "url": "pwa-192x192.png",
    "revision": "8080b3f44428f5f71d10a0fd88038976"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f53dc1268d3541cdcf054358b9b2f2a8"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "6776ffd11f74722984ce03175f781bf2"
  }, {
    "url": "manifest.webmanifest",
    "revision": "b5ae3169821e6b8f4c288168e91f7608"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
