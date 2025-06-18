const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { routePathScreenService } = require('../../services/index');

const createRoutePathScreen = catchAsync(async (req, res) => {
  const routePathScreen = await routePathScreenService.createRoutePathScreen(req.body);
  res.status(httpStatus.CREATED).send(routePathScreen);
});

const createMultipleRoutePathScreen = catchAsync(async (req, res) => {
  const routePathScreen = await routePathScreenService.createMultipleRoutePathScreen(req.body.data);
  res.status(httpStatus.CREATED).send(routePathScreen);
});

const getPathByScreenId = catchAsync(async (req, res) => {
  const routePathScreen = await routePathScreenService.getPathByScreenId(req.params.screenId);
  res.send(routePathScreen);
});

const getPathByRoutePathId = catchAsync(async (req, res) => {
  const routePathScreen = await routePathScreenService.getPathByRoutePathId(req.params.routePathId);
  res.send(routePathScreen);
});

module.exports = {
  createRoutePathScreen,
  createMultipleRoutePathScreen,
  getPathByScreenId,
  getPathByRoutePathId,
};
