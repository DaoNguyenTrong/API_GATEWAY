const httpStatus = require('http-status');
const { ApiKey } = require('../../models/index');
const { pick } = require('../../utils/pick');
const { pickToSearch } = require('../../utils/pick');
const cache = require('../../utils/node-cache');
const ApiError = require('../../utils/ApiError');

const createApiKey = async (payload = {}) => {
  const apiKey = await ApiKey.create(payload);
  const cacheKey = `apiKey:${apiKey._id}`;
  cache.set(cacheKey, apiKey);
  return apiKey;
};

const queryApiKeys = async (query = {}) => {
  const search = pickToSearch(query.keyword, ['name', 'description']);
  const filter = pick(query, ['name', 'description', 'key', 'status']);
  const options = pick(query, ['sortBy', 'limit', 'page']);
  const results = await ApiKey.paginate(filter, options, search);
  return results;
};

const getApiKeyById = async (id) => {
  const cacheKey = `apiKey:${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const apiKey = await ApiKey.findById(id);
  cache.set(cacheKey, apiKey);
  return apiKey;
};

const updateApiKeyById = async (id, payload = {}) => {
  const cacheKey = `apiKey:${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    cache.del(cacheKey);
  }
  const apiKey = await ApiKey.findById(id);
  if (!apiKey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Api key not found');
  }
  Object.assign(apiKey, payload);
  await apiKey.save();
  cache.set(`apiKeyByKey:${apiKey.key}`, apiKey);
  cache.set(cacheKey, apiKey);
  return apiKey;
};

const deleteApiKeyById = async (id) => {
  const cacheKey = `apiKey:${id}`;
  const apiKey = await getApiKeyById(id);
  if (!apiKey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Api key not found');
  }
  await apiKey.remove();
  cache.del(cacheKey);
  cache.del(`apiKeyByKey:${apiKey.key}`);
};

const getApiKeyByKey = async (key) => {
  const cacheKey = `apiKeyByKey:${key}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const apiKey = await ApiKey.findOne({ key });
  cache.set(cacheKey, apiKey);
  return apiKey;
};

const generateApiKey = async () => {
  const key = crypto.randomBytes(32).toString('hex');
  return key;
};

module.exports = {
  queryApiKeys,
  createApiKey,
  getApiKeyById,
  updateApiKeyById,
  deleteApiKeyById,
  getApiKeyByKey,
  generateApiKey,
};
