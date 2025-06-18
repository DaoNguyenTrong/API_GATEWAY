const httpStatus = require('http-status');
const { Screen } = require('../../models/index');
const ApiError = require('../../utils/ApiError');

/**
 * It creates a new screen and returns it.
 * @param {object} [screen]
 * @returns {Promise<Screen>} The screen object
 */
const createScreen = async (screen = {}) => {
  return Screen.create(screen);
};

/**
 * It returns a promise that resolves to an array of all the documents in the Screen collection.
 * @returns An array of objects.
 */
const getScreens = async (filter = {}) => {
  return Screen.find(filter);
};

/**
 * This function returns a promise that resolves to a screen object.
 * @param {ObjectId} id - the id of the screen you want to get
 * @returns {Promise<Screen>} A promise that resolves to a Screen object.
 */
const getScreenById = async (id) => {
  return Screen.findById(id);
};

/**
 * Update a screen by id, but don't allow the action to be updated to admin.
 * @param {ObjectId} id - the id of the screen to be updated
 * @param {object} body
 * @returns {Promise<Screen>} The screen object is being returned.
 */
const updateScreenById = async (id, body) => {
  const screen = await getScreenById(id);
  if (!screen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Screen not found');
  }
  if (screen.action === 'admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin is protected');
  }
  if (screen.locked && body.locked) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Screen is locked');
  }
  Object.assign(screen, body);
  await screen.save();
  return screen;
};

/**
 * If the screen is not found, throw an error. If the screen is an admin, throw an error. Otherwise,
 * delete the screen.
 * @param {ObjectId} id - The id of the screen to be deleted
 * @returns {Promise<Screen>} The screen object is being returned.
 */
const deleteScreenById = async (id) => {
  const screen = await getScreenById(id);
  if (!screen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Screen not found');
  }
  if (screen.action === 'admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin is protected');
  }
  await screen.remove();
  return screen;
};

module.exports = {
  createScreen,
  getScreenById,
  deleteScreenById,
  updateScreenById,
  getScreens,
};
