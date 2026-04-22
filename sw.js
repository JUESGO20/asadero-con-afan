const CACHE_NAME = 'asadero-con-afan-v1';

// Archivos que se guardan para funcionar sin internet
const ARCHIVOS_CACHE = [
  '/asadero-con-afan/',
  '/asadero-con-afan/index.html',
  '/asadero-con-afan/menu.html',
  '/asadero-con-afan/equipo.html',
  '/asadero-con-afan/contacto.html',
  '/asadero-con-afan/css/style.css',
  '/asadero-con-afan/js/main.js',
  '/asadero-con-afan/manifest.json'
];

// INSTALAR — guarda los archivos en caché
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos guardados en caché');
        return cache.addAll(ARCHIVOS_CACHE);
      })
  );
});

// ACTIVAR — limpia cachés viejos
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(nombres => {
      return Promise.all(
        nombres
          .filter(nombre => nombre !== CACHE_NAME)
          .map(nombre => caches.delete(nombre))
      );
    })
  );
  console.log('Service Worker activado');
});

// FETCH — responde con caché si no hay internet
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(respuestaCacheada => {
        // Si está en caché, lo devuelve
        if (respuestaCacheada) {
          return respuestaCacheada;
        }
        // Si no, lo busca en internet
        return fetch(evento.request)
          .then(respuestaRed => {
            // Si la respuesta es válida, la guarda en caché
            if (!respuestaRed || respuestaRed.status !== 200) {
              return respuestaRed;
            }
            const respuestaClonada = respuestaRed.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(evento.request, respuestaClonada));
            return respuestaRed;
          })
          .catch(() => {
            // Si no hay internet y no está en caché, muestra página de inicio
            return caches.match('/index.html');
          });
      })
  );
});