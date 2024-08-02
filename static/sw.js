importScripts("/assets/-dy/config.js?v=6-17-2024");
importScripts("/assets/-dy/worker.js?v=6-17-2024");
importScripts("/assets/-uv/bundle.js?v=6-17-2024");
importScripts("/assets/-uv/config.js?v=6-17-2024");
importScripts(__uv$config.sw || "/assets/-uv/sw.js?v=6-17-2024");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

function decode(str) {
    if (!str) return str;
    const [input, ...search] = str.split("?");
    let result = "";
    const decoded = decodeURIComponent(input);
    for (let i = 0; i < decoded.length; i++) {
        result +=
            i % 2 ? String.fromCharCode(decoded.charCodeAt(i) ^ 2) : decoded[i];
    }
    return result + (search.length ? "?" + search.join("?") : "");
}

self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
      }

      if (event.request.url.startsWith(`${location.origin}/a/`)) {
          const trimmedPath = event.request.url.replace(`${location.origin}/a/`, '');
          const decodedUrl = decode(trimmedPath);
          console.error('fetch', event.request.url, decodedUrl);
          if (decodedUrl && decodedUrl.startsWith('ms-xal-000000004c20a908://auth/')){
              console.log('Caught Access Token', decodedUrl);
              return new Response('Please wait...', {
                  status: 404,
                  headers: {
                      'Content-Type': 'text/plain',
                      'X-MSAL-TOKEN': decodedUrl
                  }
              });
          } else {
              return await uv.fetch(event);
          }
      }

      return await fetch(event.request);
    })(),
  );
});
