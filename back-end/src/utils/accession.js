const httpStatus = require('http-status');
const ApiError = require('./ApiError');
const { allRoles } = require('../config/roles');

/**
 * User only can access user's project
 * @param {object} user - the user object from the request
 * @param {object} body - the request body
 */
const checkAccession = (user, body) => {
  /** User only can access user's project */
  const roles = user.roles;
  if (!roles.includes(allRoles.admin) && !roles.includes(allRoles.accessAllProject)) {
    if (!user.PrjID.includes(body.project)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
    }
  }
};

/**
 * If the user is not an admin, then return a filter that will only return projects that the user has
 * access to
 * @param {object} user - the user object
 * @param {array} projectIds - an array of project IDs
 * @returns {object} A function that takes in a user and projectIds and returns a filter object.
 */
const pickProject = (user, projectIds, field) => {
  const filter = {};
  if (!user.roles.includes(allRoles.admin) && !user.roles.includes(allRoles.accessAllProject)) {
    filter.$or = [];
    projectIds.forEach((item) => {
      const obj = {};
      field ? (obj[field] = item) : (obj.projectId = item);
      filter.$or.push(obj);
    });
  }
  return filter;
};

module.exports = { checkAccession, pickProject };
