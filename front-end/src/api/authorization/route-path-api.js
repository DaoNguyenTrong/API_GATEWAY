import request from "@/utils/request";
import config from "@/configs/constant";

const v = config.apiVersion;

const createRoutePath = (body) => {
  return request.post(`/${v}/route-path`, body);
};

const getRoutePaths = (query = {}) => {
  return request.get(`/${v}/route-path`, {
    params: query,
  });
};

const getRoutePathById = (id) => {
  return request.get(`/${v}/route-path/${id}`);
};

const updateRoutePath = (id, body) => {
  return request.patch(`/${v}/route-path/${id}`, body);
};

const deleteRoutePath = (id) => {
  return request.delete(`/${v}/route-path/${id}`);
};

const reloadRoutes = () => {
  return request.post(`/reload-routes`);
};

const getPathChildren = (id) => {
  return request.get(`/${v}/route-path/${id}/children`);
};

export default {
  createRoutePath,
  getRoutePaths,
  getRoutePathById,
  updateRoutePath,
  deleteRoutePath,
  reloadRoutes,
  getPathChildren,
};
