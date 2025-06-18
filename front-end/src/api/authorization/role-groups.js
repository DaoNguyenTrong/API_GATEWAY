import request from "@/utils/request";
import config from "@/configs/constant";

const version = config.apiVersion;

/**
 * Create new role group
 * @param {object} data
 * @returns {Axios.request}
 */
export function createRole(role, screens) {
  return request.post(`/${version}/role`, { role, screens });
}

/**
 * Get all role groups
 * @returns {Axios.request}
 */
export function getAllRoles() {
  return request.get(`/${version}/role`);
}

/**
 * Get role group information by id
 * @param {ObjectId} id
 * @returns {Axios.request}
 */
export function getRoleById(id) {
  return request.get(`/${version}/role/${id}`);
}

/**
 * Update role group information by id
 * @param {ObjectId} id
 * @param {object} data
 * @returns {Axios.request}
 */
export function updateRoleGroup(id, role, screens) {
  return request.patch(`/${version}/role/${id}`, { role, screens });
}

/**
 * Remove role group by role id
 * @param {ObjectId} id
 * @returns {Axios.request}
 */
export function deleteRoleGroup(id) {
  return request.delete(`/${version}/role/${id}`);
}

/**
 * Get role group options for filter, selection, etc...
 * @returns {Axios.request}
 */
export function getRoleOptions() {
  return request.get(`/${version}/role/options`);
}

/**
 * Get role screens
 * @returns {Axios.request}
 */
export function getRoleScreens() {
  return request.get(`/${version}/role/role-screens`);
}

export default {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleGroup,
  deleteRoleGroup,
  getRoleOptions,
  getRoleScreens,
};
