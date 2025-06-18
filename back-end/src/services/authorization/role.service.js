const httpStatus = require('http-status');
const { allRoles } = require('../../config/roles');
const { Role, Screen } = require('../../models/index');
const ApiError = require('../../utils/ApiError');

/**
 * Get role by role'id
 * @param {Objectid} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  return Role.findById(id);
};

/**
 * Create new role
 * @param {Object} body
 * @returns {Promise<Role>}
 */
const createRole = async (body, rights = []) => {
  if (await Role.isRoleTaken(body.roleName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role name already taken');
  }
  const role = Role.create(body);
  return role;
};

/**
 * Get all roles in database
 * @returns {Promise<[Role]>}
 */
const getAllRoles = async (user) => {
  let level = 0;
  if (!user.roles.includes(allRoles.admin)) {
    const role = await Role.findById(user.roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
    level = role.level;
  }
  return Role.find({
    level: { $gte: level },
  });
};

/**
 * Update role information by role's id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRole = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (role.roleName === 'Admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin is protected');
  }
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  if (updateBody.roleName && (await Role.isRoleTaken(updateBody.roleName, roleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role already taken');
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by role's id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (role.roleName === 'Admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin is protected');
  }
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};

/**
 * This function retrieves a role object from a database based on its name.
 * @param {string} name - The `name` parameter is a string representing the name of the role that we want to
 * find in the database. This function uses the `findOne` method of the `Role` model to search for a
 * role with the specified `roleName` property and returns the found role object.
 * @returns {Promise<Role>} The `getRoleByRoleName` function returns a promise that resolves to the `role` object that
 * matches the `roleName` passed as an argument.
 */
const getRoleByRoleName = async (name) => {
  const role = await Role.findOne({ roleName: name });
  return role;
};

/**
 * This function retrieves role options from a database based on specified filters and fields.
 * @param {object} [filter] - The filter parameter is an object that specifies the conditions that the documents
 * must meet in order to be included in the result set. It is used to filter the documents based on
 * certain criteria such as matching a specific field value or range of values. For example, `{ name:
 * 'admin' }` would
 * @param {array} [fields] - The `fields` parameter is an optional array of strings that specifies which fields
 * of the `Role` document to include in the result. If `fields` is not provided, all fields will be
 * included. If `fields` is provided, only the specified fields will be included. For example, if
 * @returns {Promise<Role>} The `getRoleOptions` function is returning a promise that resolves to the result of a
 * `find` query on the `Role` collection in the database, with the specified `filter` and `fields`
 * parameters. The result will be an array of documents that match the filter criteria, with only the
 * specified fields included in each document.
 */
const getRoleOptions = async (filter = {}, fields = []) => {
  return Role.find(filter, fields);
};

/**
 * It creates a new screen in the database
 * @param {object} [body] - The body of the request.
 * @returns {Promise<Screen>} A promise that resolves to the created screen.
 */
const createScreen = async (body = {}) => {
  return Screen.create(body);
};

/**
 * It returns a screen object from the database based on the action property
 * @param {string} action - The action of the screen you want to get.
 * @returns {Promise<Screen>} A promise that resolves to a single screen object.
 */
const getScreenByAction = async (action) => {
  return Screen.findOne({ action });
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRoleById,
  getRoleByRoleName,
  getRoleOptions,
  createScreen,
  getScreenByAction,
};
