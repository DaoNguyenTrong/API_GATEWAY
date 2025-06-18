import request from "@/utils/request";
import config from "@/configs/constant";

const v = config.apiVersion;

const getApiKeyScreenByApiKeyId = (apiKeyId) => {
  return request.get(`/${v}/api-key-screen/${apiKeyId}`);
};

const createMultipleApiKeyScreen = (apiKeyId, payload) => {
  return request.post(`/${v}/api-key-screen/multiple/${apiKeyId}`, payload);
};

const updateApiKeyScreen = (apiKeyScreenId, payload) => {
  return request.patch(`/${v}/api-key-screen/${apiKeyScreenId}`, payload);
};

export default {
  getApiKeyScreenByApiKeyId,
  createMultipleApiKeyScreen,
  updateApiKeyScreen,
};
