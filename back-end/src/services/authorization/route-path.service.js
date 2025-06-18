const { pick, pickToSearch } = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const { RoutePath } = require('../../models/index');
const cache = require('../../utils/node-cache');
const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins/index');

const createRoutePath = async (routePathBody) => {
  if (await RoutePath.isPathTaken(routePathBody.path, routePathBody.method)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Route path already taken');
  }
  const routePath = await RoutePath.create(routePathBody);
  cache.del('all_route_path');
  return routePath;
};

const getRoutePathById = async (id) => {
  const routePath = await RoutePath.findById(id);
  if (!routePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Route path not found');
  }
  return routePath;
};

const paginateRoutePath = async (query) => {
  const filter = pick(query, ['method']);
  filter.isProxy = true;
  const options = pick(query, ['sortBy', 'limit', 'page']);
  const search = pickToSearch(query.keyword, ['path', 'name']);
  const results = await RoutePath.paginate(filter, options, search);
  return results;
};

const getPathChildren = async (parentId) => {
  const routePaths = await RoutePath.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(parentId) } },
    {
      $graphLookup: {
        from: 'routepaths',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentId',
        as: 'offspring',
      },
    },
  ]);
  if (routePaths.length === 0) {
    return null;
  }
  return buildTree(routePaths[0], routePaths[0].offspring);
};

const buildTree = (root, nodes) => {
  const map = new Map();
  for (const node of nodes) {
    map.set(node._id.toString(), { ...node, children: [] });
  }
  for (const node of nodes) {
    const parentId = node.parentId?.toString();
    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(map.get(node._id.toString()));
    }
  }
  const rootId = root._id.toString();
  const rootNode = { ...root, children: [] };
  for (const node of nodes) {
    if (node.parentId?.toString() === rootId) {
      rootNode.children.push(map.get(node._id.toString()));
    }
  }

  return rootNode;
};

const updateRoutePathById = async (id, routePathBody) => {
  if (await RoutePath.isPathTaken(routePathBody.path, routePathBody.method, id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Route path already taken');
  }
  const routePath = await getRoutePathById(id);
  if (!routePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Route path not found');
  }
  Object.assign(routePath, routePathBody);
  await routePath.save();
  cache.del('all_route_path');
  return routePath;
};

const deleteRoutePathById = async (id) => {
  const routePath = await getRoutePathById(id);
  if (!routePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Route path not found');
  }
  await routePath.deleteOne();
  cache.del('all_route_path');
};

const getAllRoutePath = async (skipCache = false) => {
  const cacheKey = 'all_route_path';
  const cachedData = cache.get(cacheKey);
  if (cachedData && !skipCache) {
    return cachedData;
  }
  const routePaths = await RoutePath.find({ isActive: true });
  cache.set(cacheKey, routePaths);
  return routePaths;
};

const getProxyPaths = async () => {
  const routePaths = await getAllRoutePath();
  return routePaths.filter((routePath) => routePath.isProxy);
};

module.exports = {
  createRoutePath,
  getRoutePathById,
  paginateRoutePath,
  updateRoutePathById,
  deleteRoutePathById,
  getAllRoutePath,
  getProxyPaths,
  getPathChildren,
};
