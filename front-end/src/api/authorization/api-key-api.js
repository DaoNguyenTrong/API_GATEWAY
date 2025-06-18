import request from "@/utils/request";
import config from "@/configs/constant";

const v = config.apiVersion;

const createApiKey = (body) => {
  return request.post(`/${v}/api-key`, body);
};

const getApiKeys = (query = {}) => {
  return request.get(`/${v}/api-key`, {
    params: query,
  });
};

const getApiKeyById = (id) => {
  return request.get(`/${v}/api-key/${id}`);
};

const updateApiKey = (id, body) => {
  return request.patch(`/${v}/api-key/${id}`, body);
};

const deleteApiKey = (id) => {
  return request.delete(`/${v}/api-key/${id}`);
};

export default {
  createApiKey,
  getApiKeys,
  getApiKeyById,
  updateApiKey,
  deleteApiKey,
};
