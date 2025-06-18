import request from "@/utils/request";
import config from "@/configs/constant";

const version = config.apiVersion;

/**
 * Query for users with search, filter and pagination
 * @param {string} keyword
 * @param {string} roleId
 * @param {string} sortBy
 * @param {number} limit
 * @param {number} page
 * @returns {Axios.request}
 */
export function queryUsers(keyword, roleId, sortBy, limit, page) {
  return request.get(`/${version}/account`, {
    params: { keyword, roleId, sortBy, limit, page },
  });
}

/**
 * Create new user, upload avatar
 * @param {object} data
 * @returns {Axios.request}
 */
export function createUser(data) {
  return request.post(`/${version}/account`, data);
}

/**
 * Update user information, upload avatar
 * @param {string} id
 * @param {object} data
 * @returns {Axios.request}
 */
export function updateUser(id, data) {
  delete data.status;
  delete data.roles;
  delete data.username;
  delete data.id;
  return request.patch(`/${version}/account/${id}`, data);
}

/**
 * Change user status to lock or unlock user
 * @param {string} id
 * @param {boolean} status
 * @returns {Axios.request}
 */
export function changeStatus(id, status) {
  return request.patch(`/${version}/account/${id}/change-status`, { status });
}

/**
 * Change user password
 * @param {string} id
 * @param {string} password
 * @returns {Axios.request}
 */
export function changePassword(id, password) {
  return request.patch(`/${version}/account/${id}/change-password`, {
    password,
  });
}

/**
 * Delete user by user id
 * @param {string} id
 * @returns {Axios.request}
 */
export function deleteUser(id) {
  return request.delete(`/${version}/account/${id}`);
}

/**
 * Get user information by id
 * @param {string} id
 * @returns {Axios.request}
 */
export function getUser(id) {
  return request.get(`/${version}/account/${id}`);
}

/**
 * Get role by user id
 * @param {string} id
 * @returns {Axios.request}
 */
export function getRoleByUserId(id) {
  return request.get(`/${version}/account/${id}/role`);
}

export function getScreenById(id) {
  return request.get(`/${version}/account/${id}/role-screen`);
}

/**
 * Get current account information
 * @returns {Axios.get}
 */
export function getInfo() {
  return request.get(`/${version}/account/info`);
}

/**
 * Update account information
 * @param {object} body
 * @returns {Axios.patch}
 */
export function updateInfo(body) {
  return request.patch(`/${version}/account`, body);
}

/**
 * This function will send a request to the server to change the user's password.
 * @param {string} password - The new password
 * @param {string} oldPassword - The current password of the user
 * @returns {Promise<Axios.patch>} A promise.
 */
export function changeAccountPassword(password, oldPassword) {
  return request.patch(`/${version}/account/change-password`, {
    password,
    oldPassword,
  });
}

/**
 * It returns a promise that resolves to an array of users.
 * @param {object} [filter]
 * @returns {Axios.get} A promise.
 */
export function getAllUsers(filter = {}) {
  return request.get(`/${version}/account/all`, {
    params: { filter: JSON.stringify(filter) },
  });
}

export default {
  queryUsers,
  createUser,
  updateUser,
  changeStatus,
  changePassword,
  deleteUser,
  getUser,
  getRoleByUserId,
  getInfo,
  updateInfo,
  changeAccountPassword,
  getAllUsers,
  getScreenById,
};
