const httpStatus = require('http-status');
const { File } = require('../models');
const ApiError = require('../utils/ApiError');
const { unlink, readdirSync } = require('fs');

/**
 * Query for file's information
 * @param {Object} filter
 * @param {Object} options
 * @param {Object} search
 * @param {string} PrjID
 * @returns {Promise<QueryResult>}
 */
const getFiles = async (filter, options, search) => {
  const files = await File.paginate(filter, options, search);
  return files;
};

/**
 *  Get directories by destination
 * @param {string} destination
 * @returns {List<directory>}
 */
const getDirectories = async (destination) => {
  try {
    const directories = readdirSync(destination, { withFileTypes: true });
    return directories
      .filter((file) => file.isDirectory())
      .map((file) => {
        objFile = {};
        objFile.isDirectory = file.isDirectory();
        objFile.name = file.name;
        return objFile;
      });
  } catch (error) {
    return [];
  }
};

/**
 * Save file's information
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<File>}
 */
const addFile = async (body, user) => {
  let obj = { ...body };
  if (user.id) obj.createBy = user.id;
  const file = await File.create(obj);
  return file;
};

/**
 * Get file's information by file's id
 * @param {ObjectId} id
 * @returns {Promise<File>}
 */
const getFileById = async (id) => {
  return File.findById(id);
};

/**
 * Get file information by destination and project's id
 * @param {string} destination
 * @param {string} PrjID
 * @returns {Promise<File>}
 */
const getFileByDestination = async (destination, PrjID) => {
  const query = { destination: destination, PrjID: PrjID };
  const files = await File.find(query);
  return files;
};

/**
 * Get file's information by file path
 * @param {string} path
 * @param {string} PrjID
 * @returns {Promise<File>}
 */
const getFileByPath = async (path, PrjID) => {
  const query = { path: path, PrjID: PrjID };
  const file = await File.findOne(query);
  return file;
};

/**
 * Delete file and file's information by id
 * @param {ObjectId} id
 * @returns {Promise<File>}
 */
const deleteFileById = async (id) => {
  const file = await getFileById(id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  unlink(file.path, async (error) => {
    if (error) {
      throw 'Remove file failed';
    } else {
      await file.remove();
      return file;
    }
  });
};

module.exports = {
  addFile,
  getFiles,
  getFileById,
  deleteFileById,
  getDirectories,
  getFileByDestination,
  getFileByPath,
};
