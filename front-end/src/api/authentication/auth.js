import request from "@/utils/request";
import config from "@/configs/constant";

const apiVersion = config.apiVersion;

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Axios.post}
 */
function login(username, password) {
  return request.post(`${apiVersion}/auth/login`, { username, password });
}

/**
 * Logout, send refresh token to backend
 * @param {string} refreshToken
 * @returns {Axios.post}
 */
function logout(refreshToken) {
  return request.post(`${apiVersion}/auth/logout`, { refreshToken });
}

/**
 * Get new token and refresh token by refresh token
 * @param {string} refreshToken
 * @returns {Axios.post}
 */
function refreshToken(refreshToken) {
  return request.post(`${apiVersion}/auth/refresh-tokens`, { refreshToken });
}

export default {
  login,
  logout,
  refreshToken,
};
