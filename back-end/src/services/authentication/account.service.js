const httpStatus = require('http-status');
const { User } = require('../../models/index');
const ApiError = require('../../utils/ApiError');
const roleService = require('../authorization/role.service');
const config = require('../../config/config');
const mongoose = require('mongoose');
const cache = require('../../utils/node-cache');

const ObjectId = mongoose.Types.ObjectId;

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createAccount = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  let user = { ...userBody };
  if (userBody.username !== config.root.username) {
    const role = await roleService.getRoleById(userBody.roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role group not found');
    }
  }
  return User.create(user);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAccounts = async (filter, options, search) => {
  const users = await User.paginate(filter, options, search);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getAccountById = async (id) => {
  const cacheKey = `account:${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const account = await User.findById(id);
  cache.set(cacheKey, account);
  return account;
};

/**
 * The function `getAccountByIdV2` retrieves account information by ID, including the associated role
 * and screens.
 * @param {string} id - The `id` parameter is the unique identifier of the account that you want to retrieve.
 * @returns {Promise{User}} The function `getAccountByIdV2` is returning the result of the `User.aggregate` operation.
 */
const getAccountByIdV2 = async (id) => {
  return User.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: 'roles',
        // localField: 'roleId',
        // foreignField: "_id",
        as: 'role',
        let: { role: '$roleId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$role', '$_id'] },
            },
          },
          {
            $lookup: {
              from: 'map-screens',
              // localField: '_id',
              // foreignField: "role",
              as: 'screens',
              let: { screens: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$$screens', '$role'] },
                  },
                },
                {
                  $lookup: {
                    from: 'screens',
                    // localField: 'screen',
                    // foreignField: "_id",
                    as: 'screen',
                    let: { screen: '$screen' },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ['$$screen', '$_id'] },
                        },
                      },
                      {
                        $project: { action: 1 },
                      },
                    ],
                  },
                },
                { $unwind: { path: '$screen', preserveNullAndEmptyArrays: true } },
                { $project: { screen: 1 } },
              ],
            },
          },
          { $project: { screens: 1 } },
        ],
      },
    },
    { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
    { $limit: 1 },
  ]);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getAccountByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by username
 * @param {String} username
 * @returns {Promise<User>}
 */
const getAccountByUsername = async (username) => {
  return User.findOne({ username });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAccountById = async (userId, updateBody) => {
  const user = await getAccountById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (user.username === config.root.username) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `${config.root.username} is protected`);
  // }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  let obj = { ...updateBody };
  if (user.username !== config.root.username) {
    const role = await roleService.getRoleById(updateBody.roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role group not found');
    }
  }
  Object.assign(user, obj);
  await user.save();
  const cacheKey = `account:${user._id}`;
  cache.del(cacheKey);
  return user;
};

/**
 * Change user's status by user'id
 * @param {String} userId
 * @param {Boolean} status
 * @returns {Promise<User>}
 */
const changeStatusById = async (userId, body) => {
  const user = await getAccountById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.username === config.root.username) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${config.root.username} is protected`);
  }
  const cacheKey = `account:${user._id}`;
  cache.del(cacheKey);
  user.status = body.status;
  user.updatedBy = body.updatedBy;
  await user.save();
  return user;
};

/**
 * Change user's password by user'id
 * @param {String} userId
 * @param {String} password
 * @returns
 */
const changeAccountPasswordById = async (userId, password, updatedBy) => {
  const account = await getAccountById(userId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (account.username === config.root.username) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${config.root.username} is protected`);
  }
  account.password = password;
  account.updatedBy = updatedBy;
  account.save();
  return account;
};

/**
 * Change current account password
 * @param {ObjectId} id
 * @param {string} password
 * @returns {Promise<User>}
 */
const changeAccountPassword = async (id, password, updatedBy) => {
  const user = await getAccountById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.password = password;
  user.updatedBy = updatedBy;
  user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteAccountById = async (userId) => {
  const user = await getAccountById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.username === config.root.username) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${config.root.username} is protected`);
  }
  const cacheKey = `account:${user._id}`;
  cache.del(cacheKey);
  await user.remove();
  return user;
};

/**
 * Get roles by user's id
 * @param {ObjectId} userId
 * @returns {User.roleId}
 */
const getRoleByAccount = async (userId) => {
  const user = await User.findOne({ _id: userId }, 'roleId').populate('roleId');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user.roleId;
};

/**
 * GetUsers is an async function that returns a list of users from the database.
 * @param {object} [filter] - This is an object that contains the filter criteria.
 * @returns {Promise<array<User>>} An array of users
 */
const getAccounts = async (filter = {}) => {
  const users = await User.find(filter);
  return users;
};

module.exports = {
  getAccountByIdV2,
  createAccount,
  queryAccounts,
  getAccountById,
  getAccountByEmail,
  updateAccountById,
  deleteAccountById,
  getAccountByUsername,
  changeStatusById,
  changeAccountPasswordById,
  getRoleByAccount,
  changeAccountPassword,
  getAccounts,
};
