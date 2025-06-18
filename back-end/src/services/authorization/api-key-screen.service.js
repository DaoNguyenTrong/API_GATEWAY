const { ApiKeyScreen, Screen, ApiKey } = require('../../models/index');
const cache = require('../../utils/node-cache');
const { apiKeyService } = require('../index');

const getApiKeyScreenByApiKeyId = async (apiKeyId) => {
  const apiKeyScreens = await ApiKeyScreen.find({ apiKey: apiKeyId });
  return apiKeyScreens;
};

const createApiKeyScreen = async (payload = {}) => {
  const apiKeyScreen = await ApiKeyScreen.create(payload);
  const cacheKey = `apiKeyScreen:${apiKeyScreen._id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    cache.del(cacheKey);
    cache.del(`screenByApiKey:${apiKeyScreen._id}`);
  }
  cache.set(cacheKey, apiKeyScreen);
  return apiKeyScreen;
};

const createMultipleApiKeyScreen = async (apiKeyId, payload = []) => {
  await ApiKeyScreen.deleteMany({ apiKey: apiKeyId });
  const apiKeyScreens = await ApiKeyScreen.insertMany(payload);
  payload.forEach((item) => {
    const cacheKey = `apiKeyScreen:${item._id}`;
    cache.del(cacheKey);
    cache.del(`screenByApiKey:${item.apiKey}`);
  });
  apiKeyScreens.forEach((item) => {
    const cacheKey = `apiKeyScreen:${item._id}`;
    cache.set(cacheKey, item);
  });
  return apiKeyScreens;
};

const getApiKeyScreens = async (filter = {}) => {
  const apiKeyScreens = await ApiKeyScreen.find(filter);
  return apiKeyScreens;
};

const deleteApiKeyScreenByApiKeyId = async (apiKeyId) => {
  const cacheKey = `apiKeyScreen:${apiKeyId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    cache.del(cacheKey);
    cache.del(`screenByApiKey:${apiKeyId}`);
  }
  const apiKeyScreens = await ApiKeyScreen.deleteMany({ apiKey: apiKeyId });
  return apiKeyScreens;
};

const getScreenByApiKeyId = async (apiKeyId) => {
  const cacheKey = `screenByApiKey:${apiKeyId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const apiKeyScreens = await ApiKeyScreen.find({ apiKey: apiKeyId });
  const screens = await Screen.find({ _id: { $in: apiKeyScreens.map((apiKeyScreen) => apiKeyScreen.screen) } });
  cache.set(cacheKey, screens);
  return screens;
};

const getScreenByApiKey = async (apiKey) => {
  const apiKeyData = await apiKeyService.getApiKeyByKey(apiKey);
  const cacheKey = `screenByApiKey:${apiKeyData._id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const screens = await getScreenByApiKeyId(apiKeyData._id);
  cache.set(cacheKey, screens);
  return screens;
};

module.exports = {
  createApiKeyScreen,
  createMultipleApiKeyScreen,
  getApiKeyScreenByApiKeyId,
  getApiKeyScreens,
  deleteApiKeyScreenByApiKeyId,
  getScreenByApiKeyId,
  getScreenByApiKey,
};
