import config from "@/configs/constant";
import request from "@/utils/request";
import auth from "./authentication/auth";
import file from "./file";
import project from "./project";
import user from "./user";
import options from "./options";
export { default as department } from "./department";
export { default as problem } from "./problem";
export { default as user } from "./user";
export { default as notification } from "./notification";
export { default as screen } from "./authorization/screen";
export { default as role } from "./authorization/role-groups";
export { default as project } from "./project";

/**
 * Get image content by destination
 * @param {string} destination
 * @param {string} token
 * @returns {Axios.get}
 */
export function fetchImage(destination, token) {
  return request.get(`/${destination}?token=${token}`, {
    responseType: "blob",
  });
}

/**
 * Get file content by destination
 * @param {string} des
 * @param {string} token
 * @returns {Axios.get}
 */
export function fetchFileData(des, token) {
  return request.get(`/${des}?token=${token}`, { responseType: "blob" });
}

/**
 * gen file url
 * @param {string} des
 * @param {string} token
 * @returns {string}
 */
export function buildFileUrl(des, token) {
  return `${config.baseApi}/${des}?token=${token}`;
}

export default {
  auth,
  project,
  file,
  options,
  user,
};
