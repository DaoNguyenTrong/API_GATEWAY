const { match } = require('path-to-regexp');

const findMatchingRoute = (routePaths, path, method) => {
  for (const route of routePaths) {
    const isMatch = match(route.path, { decode: decodeURIComponent });
    if (isMatch(path) && (route.method === method || route.method === null)) {
      return route;
    }
  }
  return null;
};

module.exports = {
  findMatchingRoute,
};
