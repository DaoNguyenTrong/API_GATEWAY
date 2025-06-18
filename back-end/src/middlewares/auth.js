const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { allRoles } = require('../config/roles');
const { routePathService, routePathScreenService, apiKeyService, apiKeyScreenService } = require('../services/index');
const { match } = require('path-to-regexp');

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
 * Kiểm tra quyền truy cập với route dựa trên danh sách quyền
 */
async function hasPermission(routePath, userActions = []) {
  if (!routePath) return true;
  if (userActions.includes('admin')) return true;

  const routeRights = await routePathScreenService.getPathByRoutePathId(routePath._id);

  return routeRights.some((right) => userActions.includes(right.screen.action));
}

/**
 * Callback xác thực JWT
 */
const verifyJwtCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = user;

  if (!user.status) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Your account has been locked'));
  }

  if (!user.roles.includes(allRoles.admin)) {
    if (requiredRights.length) {
      const hasRequiredRights = requiredRights.some((right) => user.roles.includes(right));
      if (!hasRequiredRights && req.params.userId !== user._id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden access'));
      }
    }
  }

  const routePaths = await routePathService.getAllRoutePath();
  const routePath = findMatchingRoute(routePaths, req.originalUrl, req.method);
  const hasAccess = await hasPermission(routePath, user.roles);

  if (!hasAccess) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden access'));
  }

  resolve();
};

/**
 * Middleware auth chính
 */
const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey) {
      const keyRecord = await apiKeyService.getApiKeyByKey(apiKey);
      if (!keyRecord) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Api key not found'));
      }
      if (keyRecord.status === false) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Api key is inactive'));
      }
      if (keyRecord.expiredDate && keyRecord.expiredDate < new Date()) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Api key is expired'));
      }

      const screenRecords = await apiKeyScreenService.getScreenByApiKey(apiKey);
      const userActions = screenRecords.map((screen) => screen.action);
      const routePaths = await routePathService.getAllRoutePath();
      const routePath = findMatchingRoute(routePaths, req.originalUrl, req.method);
      const hasAccess = await hasPermission(routePath, userActions);

      if (!hasAccess) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden access'));
      }

      req.apiKey = { ...keyRecord, screens: userActions };
      return next();
    }

    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyJwtCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
