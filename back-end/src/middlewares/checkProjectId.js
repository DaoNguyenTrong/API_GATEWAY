const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { allRoles } = require('../config/roles');

const checkProjectId = async (req, res, next) => {
  try {
    const projectId = req.headers[config.headers.projectId];
    if (!projectId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Project's id is required");
    }
    const roles = req.user.roles;
    const projectIds = req.user.PrjID;
    if (!roles.includes(allRoles.admin)) {
      if (!projectIds.includes(projectId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkProjectId;
