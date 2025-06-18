const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { routePathService } = require('../../services/index');

const createRoutePath = catchAsync(async (req, res) => {
  const routePath = await routePathService.createRoutePath(req.body);
  res.status(httpStatus.CREATED).send(routePath);
});

const getRoutePathById = catchAsync(async (req, res) => {
  const routePath = await routePathService.getRoutePathById(req.params.routePathId);
  res.send(routePath);
});

const paginateRoutePath = catchAsync(async (req, res) => {
  const routePath = await routePathService.paginateRoutePath(req.query);
  res.send(routePath);
});

const updateRoutePathById = catchAsync(async (req, res) => {
  const routePath = await routePathService.updateRoutePathById(req.params.routePathId, req.body);
  res.send(routePath);
});

const deleteRoutePathById = catchAsync(async (req, res) => {
  await routePathService.deleteRoutePathById(req.params.routePathId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPathChildren = catchAsync(async (req, res) => {
  const routePath = await routePathService.getPathChildren(req.params.routePathId);
  res.send(routePath);
});

module.exports = {
  createRoutePath,
  getRoutePathById,
  paginateRoutePath,
  updateRoutePathById,
  deleteRoutePathById,
  getPathChildren,
};
