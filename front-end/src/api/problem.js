import request from "@/utils/request";
import config from "@/configs/constant";
import { Axios } from "axios";
const version = config.apiVersion;

/**
 * It queries the problem groups
 * @param {string} keyword - string
 * @param {string} sortBy
 * @param {number} limit - The number of results to return per page.
 * @param {number} page - The page number of the results to return.
 * @returns {Axios.get} An object with a property called params.
 */
function queryProblemGroups(keyword, sortBy, limit, page, department, user) {
  return request.get(`/${version}/problem/group`, {
    params: { keyword, sortBy, limit, page, department, user },
  });
}

/**
 * It creates a problem group
 * @param {object} body
 * @returns {Axios.post} A promise.
 */
function createProblemGroup(body) {
  return request.post(`/${version}/problem/group`, body);
}

/**
 * It takes an id and a body and returns a request.patch with the id and body
 * @param {ObjectId} id - the id of the problem group
 * @param {object} body - {
 * @returns {Axios.patch} A function that takes two arguments, id and body.
 */
function updateProblemGroup(id, body) {
  return request.patch(`/${version}/problem/group/${id}`, body);
}

/**
 * It takes an id and returns a promise that will resolve to the result of a DELETE request to the
 * server
 * @param {ObjectId} id - the id of the department to be deleted
 * @returns {Axios.delete} A promise.
 */
function removeProblemGroupById(id) {
  return request.delete(`/${version}/problem/group/${id}`);
}

/**
 * It returns a promise that resolves to the response of a GET request to the URL
 * `//problem/group/all`.
 * @returns A promise.
 */
function getAllProblemGroup() {
  return request.get(`/${version}/problem/group/all`);
}

/**
 * This function returns a promise that resolves to an object containing the response from the server.
 * @param {string} keyword - string
 * @param {string} sortBy
 * @param {number} limit - number of items per page
 * @param {number} page - the page number
 * @param {number} status - 'open' or 'closed'
 * @param {number} priority - 1, 2, 3, 4, 5
 * @returns {Axios.get} An object with a property called params.
 */
function queryProblem(keyword, sortBy, limit, page, status, priority) {
  return request.get(`/${version}/problem/item`, {
    params: { keyword, sortBy, limit, page, status, priority },
  });
}

/**
 * It creates a problem in the system.
 * @param {object} body - {
 * @returns {Axios.post} A promise that resolves to the response object.
 */
function createProblem(body) {
  return request.post(`/${version}/problem/item`, body);
}

/**
 * It returns a promise that resolves to the response of a GET request to the URL
 * `/v1/problem/item/{id}`
 * @param {ObjectId} id - the id of the problem
 * @returns {Axios.get} A promise.
 */
function getProblemById(id) {
  return request.get(`/${version}/problem/item/${id}`);
}

/**
 * It takes an id and a body, and returns a promise that resolves to the result of a PATCH request to
 * the `/problem/:id` endpoint
 * @param {ObjectId} id - the id of the problem you want to update
 * @param {object} body - {
 * @returns {Axios.patch} A function that takes two arguments, id and body.
 */
function updateProblemById(id, body) {
  return request.patch(`/${version}/problem/item/${id}`, body);
}

/**
 * It deletes a problem by id
 * @param {ObjectId} id - the id of the problem to delete
 * @returns {Axios.delete} A function that takes an id and returns a promise.
 */
function removeProblemById(id) {
  return request.delete(`/${version}/problem/item/${id}`);
}

export default {
  queryProblemGroups,
  createProblemGroup,
  updateProblemGroup,
  removeProblemGroupById,
  getAllProblemGroup,
  queryProblem,
  createProblem,
  getProblemById,
  updateProblemById,
  removeProblemById,
};
