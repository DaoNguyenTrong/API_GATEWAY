import request from "@/utils/request";
import config from "@/configs/constant";

const version = config.apiVersion;
const options = `/${version}/option`;

/**
 * Get all options
 * @returns {Promise} A promise.
 */
export function getOptions() {
  return request.get(options);
}

export default {
  getOptions,
};
