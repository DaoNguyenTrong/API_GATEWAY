const { createProxyMiddleware } = require('http-proxy-middleware');
const auth = require('../middlewares/auth.js');
const { routePathService } = require('../services/index.js');
const { rateLimit } = require('express-rate-limit');
const { match } = require('path-to-regexp');

let proxyLayers = []; // lưu lại route đã gắn, để gỡ khi reload
let limiters = {};

function clearProxyRoutes(app) {
  // Gỡ toàn bộ route proxy đã đăng ký
  app._router.stack = app._router.stack.filter((layer) => !proxyLayers.includes(layer));
  proxyLayers = [];
  limiters = {};
}

/**
 * Trả về danh sách các pattern từ path gốc đến cụ thể (từ dài đến ngắn)
 */
function getPossiblePatterns(path) {
  const parts = path.split('/').filter(Boolean);
  const patterns = [];

  for (let i = parts.length; i >= 1; i--) {
    const partial = '/' + parts.slice(0, i).join('/');
    patterns.push(partial);
  }

  return patterns;
}

/**
 * Tìm route trong DB phù hợp với request hiện tại
 */
function findMatchingRoute(routePaths, reqPath, method) {
  const candidates = getPossiblePatterns(reqPath);
  for (const pathCandidate of candidates) {
    for (const route of routePaths) {
      const isMatch = match(route.path, { decode: decodeURIComponent });
      if (isMatch(pathCandidate) && (route.method === method || route.method === null)) {
        return route;
      }
    }
  }
  return null;
}

/**
 * Tạo rate limiter dựa trên route path
 */
const createRateLimiter = async (routePath) => {
  const { limit, windowMs } = routePath;
  if (limit && windowMs) {
    const limiter = rateLimit({
      windowMs: windowMs,
      max: limit,
      standardHeaders: false,
      legacyHeaders: true,
      message: 'Too many requests',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    });
    if (routePath.method) {
      limiters[`${routePath.path}-${routePath.method}`] = limiter;
    } else {
      limiters[routePath.path] = limiter;
    }
  }
};

const dynamicRateLimiter = async (req, res, next) => {
  const paths = getPossiblePatterns(req.originalUrl);
  for (const path of paths) {
    const limiter = limiters[`${path}-${req.method}`] || limiters[path];
    if (limiter) {
      return limiter(req, res, next);
    }
  }
  return next();
};

async function reloadProxyRoutes(app) {
  console.log('Reloading proxy routes...');
  clearProxyRoutes(app);

  const routes = await routePathService.getAllRoutePath(true);
  for (const route of routes) {
    const { path, host, method } = route;
    try {
      const middleware = [auth(), dynamicRateLimiter];
      createRateLimiter(route);
      if (host && !route.parentId && route.isProxy) {
        const url = new URL(host);
        const target = `${url.protocol}//${url.host}`; // domain gốc
        const basePath = url.pathname.replace(/\/$/, ''); // giữ subpath nếu có

        const proxy = createProxyMiddleware({
          target,
          changeOrigin: true,
          pathRewrite: (reqPath, req) => {
            const cleaned = reqPath.replace(path, ''); // xoá phần prefix
            return basePath + cleaned; // gắn subpath lại
          },
          logLevel: 'warn',
        });
        middleware.push(proxy);
        console.log(`Mounted proxy: ${path} → ${target}${basePath}`);
        const layer = app.use(path, ...middleware);
        proxyLayers.push(layer);
        continue;
      }
      if (middleware.length > 0) {
        let layer;
        if (method === 'ALL' || !method) {
          layer = app.use(path, ...middleware);
        } else if (method === 'GET') {
          layer = app.get(path, ...middleware);
        } else if (method === 'POST') {
          layer = app.post(path, ...middleware);
        } else if (method === 'PUT') {
          layer = app.put(path, ...middleware);
        } else if (method === 'DELETE') {
          layer = app.delete(path, ...middleware);
        } else if (method === 'PATCH') {
          layer = app.patch(path, ...middleware);
        } else if (method === 'OPTIONS') {
          layer = app.options(path, ...middleware);
        } else if (method === 'HEAD') {
          layer = app.head(path, ...middleware);
        }
        proxyLayers.push(layer);
        continue;
      }
    } catch (err) {
      console.error(`Invalid host URL: ${host}`);
      console.log(err);
    }
  }
}

module.exports = {
  reloadProxyRoutes,
};
