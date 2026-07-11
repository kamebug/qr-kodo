/* QR Kodo Service Worker
 * Estratégia: cache-first para o app shell e recursos externos (CDN, fontes).
 * Para atualizar o app publicado, incremente CACHE_VERSION — o SW antigo
 * é descartado no evento "activate".
 */
const CACHE_VERSION = "qrkodo-v8";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "https://cdn.jsdelivr.net/npm/qr-code-styling@1.6.0-rc.1/lib/qr-code-styling.js",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap",
];

/* Instalação: pré-cacheia o shell. As fontes .woff2 do Google Fonts
 * são cacheadas sob demanda no fetch (as URLs variam por navegador). */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/* Ativação: remove caches de versões anteriores. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* Fetch: cache-first com preenchimento do cache em segundo plano.
 * Só trata GET; requisições de outros métodos passam direto. */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cacheia respostas válidas (inclui opaque p/ fontes cross-origin)
          if (response && (response.ok || response.type === "opaque")) {
            const clone = response.clone();
            caches
              .open(CACHE_VERSION)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline e fora do cache: para navegação, devolve o shell
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return Response.error();
        });
    })
  );
});
