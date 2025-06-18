import request from "@/utils/request";

import constant from "@/configs/constant";

const v = constant.apiVersion;

const getRoutePathScreens = (query = {}) => {
  return request.get(`/${v}/route-path-screen`, {
    params: query,
  });
};

const createRoutePathScreen = (body) => {
  return request.post(`/${v}/route-path-screen`, body);
};

const createMultipleRoutePathScreen = (body) => {
  return request.post(`/${v}/route-path-screen/multiple`, body);
};

const getPathByScreenId = (screenId) => {
  return request.get(`/${v}/route-path-screen/screen/${screenId}`);
};

const getPathByRoutePathId = (routePathId) => {
  return request.get(`/${v}/route-path-screen/route-path/${routePathId}`);
};

export default {
  getRoutePathScreens,
  createRoutePathScreen,
  createMultipleRoutePathScreen,
  getPathByScreenId,
  getPathByRoutePathId,
};
