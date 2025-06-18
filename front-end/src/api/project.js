import request from "@/utils/request";
import config from "@/configs/constant";

const version = config.apiVersion;

/**
 * Query for projects
 * @param {string} keyword
 * @param {string} sortBy
 * @param {number} limit
 * @param {number} page
 * @param {object} filter
 * @returns {Axios.request}
 */
export function queryProject(keyword, sortBy, limit, page, filter = {}) {
  return request.get(`/ict/${version}/projects`, {
    params: {
      keyword,
      sortBy,
      limit,
      page,
      type: filter.type,
      software: filter.software,
    },
  });
}

/**
 * Get project information by id
 * @param {string} id
 * @returns {Axios.request}
 */
export function getProjectById(id) {
  return request.get(`/ict/${version}/projects/${id}`);
}

/**
 * Create new project
 * @param {object} data
 * @returns {Axios.request}
 */
export function createProject(data) {
  return request.post(`/ict/${version}/projects`, data);
}

/**
 * Update project information by project id
 * @param {string} id
 * @param {object} data
 * @returns {Axios.request}
 */
export function updateProject(id, data) {
  return request.patch(`/ict/${version}/projects/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Get project options
 * @returns {Axios.request}
 */
export function getProjectOptions() {
  return request.get(`/ict/${version}/projects/options`);
}

export function getAllProjectOptions() {
  return request.get(`/ict/${version}/projects/options`);
}

/**
 * It takes a filter object and returns a list of projects that match the filter.
 * @param {object} [filter] - {
 * @returns {Axios.get} An array of projects
 */
export function getProjectsByFilter(filter = {}) {
  return request.get(`/ict/${version}/projects/filter`, {
    params: { filter: JSON.stringify(filter) },
  });
}

/**
 * Query for regulatory
 * @param {string} keyword
 * @param {string} sortBy
 * @param {number} limit
 * @param {number} page
 * @param {string} Status
 * @returns {Axios.request}
 */
export function queryRegulatories(keyword, sortBy, limit, page, Status) {
  return request.get(`/ict/${version}/regulatory`, {
    params: { keyword, sortBy, limit, page, Status },
  });
}

/**
 * Get regulatory by id
 * @param {ObjectId} id
 * @returns {Axios.request}
 */
export function getRegulatoryById(id) {
  return request.get(`/ict/${version}/regulatory/${id}`);
}

/**
 * Create new regulatory
 * @param {object} body
 * @returns {Axios.request}
 */
export function createRegulatory(body) {
  return request.post(`/ict/${version}/regulatory`, body);
}

/**
 * Update regulatory by id
 * @param {ObjectId} id
 * @param {object} body
 * @returns {Axios.request}
 */
export function updateRegulatory(id, body) {
  return request.patch(`/ict/${version}/regulatory/${id}`, body);
}

/**
 * Delete regulatory by id
 * @param {ObjectId} id
 * @returns {Axios.request}
 */
export function deleteRegulatory(id) {
  return request.delete(`/ict/${version}/regulatory/${id}`);
}

/**
 * Query for project report
 * @param {string} keyword
 * @param {string} sortBy
 * @param {number} limit
 * @param {number} page
 * @param {string} Status
 * @param {string} projectId
 * @returns {Axios.get}
 */
export function queryProjectReport(
  keyword,
  sortBy,
  limit,
  page,
  Status,
  projectId
) {
  return request.get(`/ict/${version}/project-report`, {
    params: { keyword, sortBy, limit, page, Status, projectId },
  });
}

/**
 * Get project report by id
 * @param {string} id
 * @returns {Axios.request}
 */
export function getProjectReportById(id) {
  return request.get(`/ict/${version}/project-report/${id}`);
}

/**
 * Create new project report
 * @param {object} body
 * @returns {Axios.request}
 */
export function createProjectReport(body) {
  return request.post(`/ict/${version}/project-report`, body);
}

/**
 * Update project report
 * @param {string} id
 * @param {object} body
 * @returns {Axios.request}
 */
export function updateProjectReport(id, body) {
  return request.patch(`/ict/${version}/project-report/${id}`, body);
}

/**
 * Delete project report
 * @param {string} id
 * @returns {Axios.request}
 */
export function deleteProjectReport(id) {
  return request.delete(`/ict/${version}/project-report/${id}`);
}

/**
 * Query for project drawing
 * @param {string} keyword
 * @param {string} sortBy
 * @param {number} limit
 * @param {number} page
 * @returns {Axios.get}
 */
export function queryDrawing(keyword, sortBy, limit, page) {
  return request.get(`/ict/${version}/drawing`, {
    params: { keyword, sortBy, limit, page },
  });
}

/**
 * Create project drawing
 * @param {object} body
 * @returns {Axios.post}
 */
export function createDrawing(body) {
  return request.post(`/ict/${version}/drawing`, body);
}

/**
 * Get project drawing by id
 * @param {ObjectId} id
 * @returns {Axios.get}
 */
export function getDrawingById(id) {
  return request.get(`/ict/${version}/drawing/${id}`);
}

/**
 * Update project drawing by id
 * @param {ObjectId} id
 * @param {object} body
 * @returns {Axios.patch}
 */
export function updateDrawingById(id, body) {
  return request.patch(`/ict/${version}/drawing/${id}`, body);
}

/**
 * Delete project drawing by id
 * @param {ObjectId} id
 * @returns {Axios.delete}
 */
export function deleteDrawingById(id) {
  return request.delete(`/ict/${version}/drawing/${id}`);
}

/**
 * Get project drawings by project id
 * @param {string} projectId
 * @returns {Axios.get}
 */
export function getDrawingByProject(projectId) {
  return request.get(`/ict/${version}/drawing/project`, {
    params: { projectId },
  });
}

export default {
  queryProject,
  getProjectById,
  createProject,
  updateProject,
  getProjectOptions,
  getProjectsByFilter,
  queryRegulatories,
  getRegulatoryById,
  createRegulatory,
  updateRegulatory,
  deleteRegulatory,
  queryProjectReport,
  getProjectReportById,
  createProjectReport,
  updateProjectReport,
  deleteProjectReport,
  queryDrawing,
  createDrawing,
  getDrawingById,
  updateDrawingById,
  deleteDrawingById,
  getDrawingByProject,
  getAllProjectOptions,
};
