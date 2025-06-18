import request from "@/utils/request";
import config from "@/configs/constant";

const v = config.apiVersion;

/**
 * It creates a new screen.
 * @param {object} body - The body of the request.
 * @returns {Promise<Axios.post>} A function that takes a body and returns a request.post()
 */
function createScreen(body) {
  return request.post(`/${v}/screen`, body);
}

/**
 * It returns a promise that resolves to an array of screens.
 * @returns {Promise<Axios.get>} A promise.
 */
function getScreens(query = {}) {
  return request.get(`/${v}/screen`, {
    params: query,
  });
}

/**
 * It takes an id and a body, and returns a promise that resolves to the result of a POST request to
 * the url `//screen/` with the body
 * @param {ObjectId} id - The id of the screen you want to update
 * @param {object} body - {
 * @returns {Promise<Axios.patch>} A function that takes an id and a body and returns a promise.
 */
function updateScreen(id, body) {
  return request.patch(`/${v}/screen/${id}`, body);
}

/**
 * It takes an id, and returns a promise that will resolve to the result of a DELETE request to the
 * server
 * @param {ObjectId} id - The id of the screen you want to delete
 * @returns {Promise<Axios.delete>} A promise.
 */
function deleteScreen(id) {
  return request.delete(`/${v}/screen/${id}`);
}

function getAccessedTools() {
  return request.get(`/${v}/screen/tools`);
}

export default {
  createScreen,
  getScreens,
  updateScreen,
  deleteScreen,
  getAccessedTools,
};
