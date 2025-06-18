const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { apiKeyScreenService } = require('../../services/index');

const createAsync = catchAsync(async (req, res) => {
  const apiKeyScreen = await apiKeyScreenService.createApiKeyScreen(req.body);
  res.status(httpStatus.CREATED).send(apiKeyScreen);
});

const createMultipleAsync = catchAsync(async (req, res) => {
  const apiKeyScreens = await apiKeyScreenService.createMultipleApiKeyScreen(req.params.apiKeyId, req.body.data);
  res.status(httpStatus.CREATED).send(apiKeyScreens);
});

const updateAsync = catchAsync(async (req, res) => {
  const apiKeyScreen = await apiKeyScreenService.updateApiKeyScreen(req.params.apiKeyScreenId, req.body);
  res.send(apiKeyScreen);
});

const getApiKeyScreenByApiKeyIdAsync = catchAsync(async (req, res) => {
  const apiKeyScreen = await apiKeyScreenService.getApiKeyScreenByApiKeyId(req.params.apiKeyId);
  res.send(apiKeyScreen);
});

const getApiKeyScreensAsync = catchAsync(async (req, res) => {
  const apiKeyScreens = await apiKeyScreenService.getApiKeyScreens(req.query);
  res.send(apiKeyScreens);
});

const deleteApiKeyScreenByApiKeyIdAsync = catchAsync(async (req, res) => {
  await apiKeyScreenService.deleteApiKeyScreenByApiKeyId(req.params.apiKeyId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getScreenByApiKeyAsync = catchAsync(async (req, res) => {
  const screen = await apiKeyScreenService.getScreenByApiKey(req.params.apiKey);
  res.send(screen);
});

module.exports = {
  createAsync,
  createMultipleAsync,
  updateAsync,
  getApiKeyScreenByApiKeyIdAsync,
  getApiKeyScreensAsync,
  deleteApiKeyScreenByApiKeyIdAsync,
  getScreenByApiKeyAsync,
};
