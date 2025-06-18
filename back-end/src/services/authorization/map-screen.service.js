const httpStatus = require('http-status');
const mapScreen = require('../../models/authorization/map-screen.model');
const { MapScreen } = require('../../models/index');
const ApiError = require('../../utils/ApiError');
const cache = require('../../utils/node-cache');

/**
 * Get screen by role id
 * @param {ObjectId} roleId - the id of the role
 * @returns {Promise<MapScreen>} An array of MapScreen objects.
 */
const getMapScreenByRole = async (role) => {
  const cacheKey = `mapScreen:${role}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const mapScreens = await MapScreen.find({ role }).populate('screen');
  cache.set(cacheKey, mapScreens);
  return mapScreens;
};

/**
 * Create a new MapScreen object with the given role and screen, and return it.
 * @param {ObjectId} role - The role that the user has to be in order to see the screen.
 * @param {ObjectId} screen - {
 * @returns {Promise<MapScreen>} A promise that resolves to the newly created MapScreen instance.
 */
const createMapScreen = async (role, screen) => {
  const mapScreen = await MapScreen.create({ role, screen });
  const cacheKey = `mapScreen:${role}`;
  cache.del(cacheKey);
  return mapScreen;
};

/**
 * This function returns a MapScreen object from the database, given an id.
 * @param {ObjectId} id - the id of the map screen
 * @returns {Promise<MapScreen>} A promise.
 */
const getMapScreenById = async (id) => {
  return MapScreen.findById(id).populate('screen');
};

/**
 * This function deletes a map screen by id.
 * @param {ObjectId} id - the id of the map screen to be deleted
 * @returns {Promise<MapScreen>} The mapScreen object is being returned.
 */
const deleteMapScreenById = async (id) => {
  const mapScreen = await getMapScreenById(id);
  if (!mapScreen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Map screen not found');
  }
  await mapScreen.remove();
  const cacheKey = `mapScreen:${mapScreen.role}`;
  cache.del(cacheKey);
  return mapScreen;
};

/**
 * Delete all mapScreens that have a role that matches the role passed in as an argument.
 * @param {ObjectId} role - Role id
 * @returns {Promise} The result of the deleteMany() method.
 */
const deleteMapScreenByRole = async (role) => {
  const mapScreens = await mapScreen.deleteMany({ role });
  const cacheKey = `mapScreen:${role}`;
  cache.del(cacheKey);
  return mapScreens;
};

module.exports = {
  getMapScreenByRole,
  createMapScreen,
  getMapScreenById,
  deleteMapScreenById,
  deleteMapScreenByRole,
};
