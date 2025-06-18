const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { apiKeyService } = require('../../services/index');

const createApiKey = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = {
    ...req.body,
    createdBy: user._id,
  };
  const apiKey = await apiKeyService.createApiKey(payload);
  res.status(httpStatus.CREATED).send(apiKey);
});

const getApiKeyById = catchAsync(async (req, res) => {
  const apiKey = await apiKeyService.getApiKeyById(req.params.apiKeyId);
  res.send(apiKey);
});

const getApiKeys = catchAsync(async (req, res) => {
  const apiKeys = await apiKeyService.queryApiKeys(req.query);
  res.send(apiKeys);
});

const updateApiKeyById = catchAsync(async (req, res) => {
  const apiKey = await apiKeyService.updateApiKeyById(req.params.apiKeyId, req.body);
  res.send(apiKey);
});

const deleteApiKeyById = catchAsync(async (req, res) => {
  await apiKeyService.deleteApiKeyById(req.params.apiKeyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createApiKey,
  getApiKeyById,
  getApiKeys,
  updateApiKeyById,
  deleteApiKeyById,
};
