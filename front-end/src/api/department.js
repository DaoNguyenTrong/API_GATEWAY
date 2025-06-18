import request from "@/utils/request";
import config from "@/configs/constant";
const version = config.apiVersion;

/**
 * Query for departments
 * @param {string} keyword - string
 * @param {string} sortBy - 'name' or '-name'
 * @param {number} limit - number of items per page
 * @param {number} page - the page number
 * @returns {Axios.get} A promise.
 */
function queryDepartments(keyword, sortBy, limit, page) {
  return request.get(`/${version}/department`, {
    params: { keyword, sortBy, limit, page },
  });
}

/**
 * It creates a department.
 * @param {object} body - The body of the request.
 * @returns {Axios.post} A promise that resolves to the response from the server.
 */
function createDepartment(body) {
  return request.post(`/${version}/department`, body);
}

/**
 * This function updates a department with the given id and body.
 * @param {ObjectId} id - The id of the department you want to update
 * @param {object} body - {
 * @returns {Axios.patch} A function that takes two arguments, id and body.
 */
function updateDepartment(id, body) {
  return request.patch(`/${version}/department/${id}`, body);
}

/**
 * It returns a promise that will resolve to the result of a DELETE request to the URL
 * `/v1/department/:id` where `:id` is the value of the `id` parameter
 * @param {ObjectId} id - The id of the department to be deleted.
 * @returns {Axios.delete} A promise.
 */
function removeDepartmentById(id) {
  return request.delete(`/${version}/department/${id}`);
}

/**
 * It returns a promise that resolves to an array of departments
 * @param {object} [filter]
 * @returns {Axios.get} A promise.
 */
function getDepartments(filter = {}) {
  return request.get(`/${version}/department/filter`, {
    params: { filter },
  });
}

export default {
  queryDepartments,
  createDepartment,
  updateDepartment,
  removeDepartmentById,
  getDepartments,
};
