const { RoutePathScreen } = require('../../models/index');
const cache = require('../../utils/node-cache');

const createRoutePathScreen = async (routePathScreenBody) => {
  const cacheKey = `routePathScreen:${routePathScreenBody.routePath}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    cache.del(cacheKey);
    cache.del(`routePathScreen:routePath:${routePathScreenBody.routePath}`);
    cache.del(`routePathScreen:screen:${routePathScreenBody.screen}`);
  }
  const routePathScreen = await RoutePathScreen.create(routePathScreenBody);
  cache.set(cacheKey, routePathScreen);
  return routePathScreen;
};

const createMultipleRoutePathScreen = async (routePathScreenBody = []) => {
  await RoutePathScreen.deleteMany({ routePath: { $in: routePathScreenBody.map((item) => item.routePath) } });
  const routePathScreen = await RoutePathScreen.insertMany(routePathScreenBody);
  routePathScreenBody.forEach((item) => {
    const cacheKey = `routePathScreen:${item.routePath}`;
    cache.del(cacheKey);
    cache.del(`routePathScreen:routePath:${item.routePath}`);
    cache.del(`routePathScreen:screen:${item.screen}`);
  });
  routePathScreen.forEach((item) => {
    const cacheKey = `routePathScreen:${item.routePath}`;
    cache.set(cacheKey, item);
  });
  return routePathScreen;
};

const getPathByScreenId = async (screenId) => {
  const cacheKey = `routePathScreen:screen:${screenId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const routePathScreen = await RoutePathScreen.find({ screen: screenId });
  cache.set(cacheKey, routePathScreen);
  return routePathScreen;
};

const getPathByRoutePathId = async (routePathId) => {
  const cacheKey = `routePathScreen:routePath:${routePathId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const routePathScreen = await RoutePathScreen.find({ routePath: routePathId }).populate('screen');
  cache.set(cacheKey, routePathScreen);
  return routePathScreen;
};

module.exports = {
  createRoutePathScreen,
  createMultipleRoutePathScreen,
  getPathByScreenId,
  getPathByRoutePathId,
};
