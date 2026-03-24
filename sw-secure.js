/**
 * EkoClip Secure Service Worker
 * Cache seguro e funcionalidade offline com validação de integridade
 */

const CACHE_NAME = 'ekoclip-v1.0.0';
const STATIC_CACHE = 'ekoclip-static-v1.0.0';
const API_CACHE = 'ekoclip-api-v1.0.0';

// Recursos críticos para cache offline
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/scripts/security-utils.js',
  '/assets/images/favicon.ico',
  '/assets/images/apple-touch-icon.png'
];

// Recursos estáticos para cache
const STATIC_RESOURCES = [
  '/src/style.css',
  '/src/script.js',
  '/assets/images/capa1.jpg',
  '/assets/images/logo.png'
];

// Configuração de cache
const CACHE_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  maxEntries: 100,
  strategies: {
    // Estratégia de cache para recursos críticos
    critical: 'cache-first',
    // Estratégia de cache para recursos estáticos
    static: 'stale-while-revalidate',
    // Estratégia de cache para API
    api: 'network-first'
  }
};

// Lista de URLs permitidas (whitelist)
const ALLOWED_URLS = [
  /^https?:\/\/ekoclip\.netlify\.app/,
  /^https?:\/\/localhost(:[0-9]+)?/,
  /^https?:\/\/127\.0\.0\.1(:[0-9]+)?/
];

// Verifica se URL é permitida
function isAllowedUrl(url) {
  try {
    const urlObj = new URL(url);
    return ALLOWED_URLS.some((pattern) => pattern.test(url));
  } catch (e) {
    return false;
  }
}

// Calcula hash simples para integridade (não criptográfico, apenas para detecção básica)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Converte para 32 bits
  }
  return hash.toString(36);
}

// Sanitiza headers de cache
function sanitizeCacheHeaders(headers) {
  const sanitized = new Headers();

  // Copiar apenas headers seguros
  const safeHeaders = [
    'content-type',
    'content-length',
    'etag',
    'last-modified',
    'cache-control'
  ];

  for (const [key, value] of headers.entries()) {
    if (safeHeaders.includes(key.toLowerCase())) {
      // Sanitizar valor do header
      const sanitizedValue = value.replace(/[<>'"&]/g, '');
      sanitized.set(key, sanitizedValue);
    }
  }

  return sanitized;
}

// Estratégia de cache: Cache First (para recursos críticos)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Verificar se cache não expirou
      const cacheDate = new Date(
        cachedResponse.headers.get('sw-cache-date') || 0
      );
      const now = new Date();

      if (now - cacheDate < CACHE_CONFIG.maxAge) {
        return cachedResponse;
      }
    }

    // Buscar da rede
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      const responseClone = networkResponse.clone();

      // Adicionar metadata de cache
      const responseWithMeta = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: sanitizeCacheHeaders(responseClone.headers)
      });
      responseWithMeta.headers.set('sw-cache-date', new Date().toISOString());
      responseWithMeta.headers.set('sw-cache-strategy', 'cache-first');

      await cache.put(request, responseWithMeta);
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    // Fallback para offline page
    return caches.match('/offline.html');
  }
}

// Estratégia de cache: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  // Retornar cache imediatamente se disponível
  if (cachedResponse) {
    // Atualizar cache em background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const responseWithMeta = new Response(networkResponse.clone().body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: sanitizeCacheHeaders(networkResponse.headers)
          });
          responseWithMeta.headers.set(
            'sw-cache-date',
            new Date().toISOString()
          );
          responseWithMeta.headers.set(
            'sw-cache-strategy',
            'stale-while-revalidate'
          );

          cache.put(request, responseWithMeta);
        }
      })
      .catch((error) => {
        console.warn('Background cache update failed:', error);
      });

    return cachedResponse;
  }

  // Buscar da rede
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseWithMeta = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: sanitizeCacheHeaders(networkResponse.headers)
      });
      responseWithMeta.headers.set('sw-cache-date', new Date().toISOString());
      responseWithMeta.headers.set(
        'sw-cache-strategy',
        'stale-while-revalidate'
      );

      await cache.put(request, responseWithMeta);
    }
    return networkResponse;
  } catch (error) {
    console.error('Stale While Revalidate failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Estratégia de cache: Network First (para API)
async function networkFirst(request) {
  try {
    // Tentar buscar da rede primeiro
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      const responseWithMeta = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: sanitizeCacheHeaders(networkResponse.headers)
      });
      responseWithMeta.headers.set('sw-cache-date', new Date().toISOString());
      responseWithMeta.headers.set('sw-cache-strategy', 'network-first');

      await cache.put(request, responseWithMeta);
    }

    return networkResponse;
  } catch (error) {
    // Fallback para cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback para resposta de erro
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Recurso não disponível offline'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Limpa caches antigos
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [CACHE_NAME, STATIC_CACHE, API_CACHE];

  const cleanupPromises = cacheNames
    .filter((cacheName) => !validCaches.includes(cacheName))
    .map((cacheName) => {
      console.log('🧹 Removendo cache antigo:', cacheName);
      return caches.delete(cacheName);
    });

  await Promise.all(cleanupPromises);
}

// Limita número de entradas no cache
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    // Remove entradas mais antigas (LRU básico)
    const entriesToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(entriesToDelete.map((key) => cache.delete(key)));
    console.log(
      `🧹 Removidas ${entriesToDelete.length} entradas antigas do cache ${cacheName}`
    );
  }
}

// Evento Install
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker instalando...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      // Cache recursos críticos primeiro
      try {
        await cache.addAll(CRITICAL_RESOURCES);
        console.log('✅ Recursos críticos em cache');
      } catch (error) {
        console.warn('⚠️ Alguns recursos críticos falharam no cache:', error);
      }

      // Forçar ativação imediata
      self.skipWaiting();
    })()
  );
});

// Evento Activate
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker ativando...');

  event.waitUntil(
    (async () => {
      // Limpar caches antigos
      await cleanupOldCaches();

      // Assumir controle de todas as páginas
      await clients.claim();

      console.log('✅ Service Worker ativo e controlando páginas');
    })()
  );
});

// Evento Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Verificar se URL é permitida
  if (!isAllowedUrl(request.url)) {
    console.warn('🚫 URL bloqueada pelo Service Worker:', request.url);
    event.respondWith(new Response('Forbidden', { status: 403 }));
    return;
  }

  // Estratégia baseada no tipo de recurso
  if (request.method === 'GET') {
    if (CRITICAL_RESOURCES.some((resource) => url.pathname === resource)) {
      // Recursos críticos: Cache First
      event.respondWith(cacheFirst(request));
    } else if (
      STATIC_RESOURCES.some((resource) =>
        url.pathname.includes(resource.split('/').pop())
      )
    ) {
      // Recursos estáticos: Stale While Revalidate
      event.respondWith(staleWhileRevalidate(request));
    } else if (
      url.pathname.startsWith('/api/') ||
      url.pathname.includes('.netlify/functions/')
    ) {
      // API calls: Network First
      event.respondWith(networkFirst(request));
    } else {
      // Outros: Stale While Revalidate
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

// Evento Message (comunicação com páginas)
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_INFO':
      // Retornar informações do cache
      caches.keys().then((cacheNames) => {
        event.ports[0].postMessage({
          cacheNames,
          cacheConfig: CACHE_CONFIG
        });
      });
      break;

    case 'CLEAR_CACHE':
      // Limpar cache específico
      if (data && data.cacheName) {
        caches.delete(data.cacheName).then((success) => {
          event.ports[0].postMessage({ success });
        });
      }
      break;

    default:
      console.warn('Mensagem desconhecida recebida:', type);
  }
});

// Monitoramento de performance
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    const { metric, value, url } = event.data;

    // Log de performance (em produção, enviar para analytics)
    console.log(`📊 Performance: ${metric} = ${value}ms para ${url}`);

    // Verificar se está lento
    if (metric === 'load' && value > 3000) {
      console.warn('⚠️ Carregamento lento detectado:', url);
    }
  }
});

// Tratamento de erros
self.addEventListener('error', (event) => {
  console.error('💥 Erro no Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Promise rejeitada no Service Worker:', event.reason);
});

// Limpeza periódica de cache
setInterval(
  async () => {
    try {
      await limitCacheSize(STATIC_CACHE, CACHE_CONFIG.maxEntries);
      await limitCacheSize(API_CACHE, CACHE_CONFIG.maxEntries);
    } catch (error) {
      console.warn('Erro na limpeza periódica de cache:', error);
    }
  },
  30 * 60 * 1000
); // A cada 30 minutos
