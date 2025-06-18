const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services/index');
const config = require('../config/config');
const fs = require('node:fs');
const exec = require('node:child_process').exec;

const getFileByDestination = catchAsync(async (req, res) => {
  let destination = req.query.destination;
  if (destination[0] === '/') destination = destination.slice(1);
  if (destination[destination.length - 1] === '/') destination = destination.slice(0, destination.length - 1);
  if (destination) destination = config.staticFolder + '/' + destination;
  const files = await fileService.getFileByDestination(destination, req.headers[config.headers.PrjID]);
  res.send(files);
});

const getDirectories = catchAsync(async (req, res) => {
  let mainPath = config.staticFolder;
  let destination = req.query.destination;
  if (destination) {
    mainPath = mainPath + '/' + destination;
  }
  const files = await fileService.getDirectories(mainPath);
  res.send(files);
});

const getFileByPath = catchAsync(async (req, res) => {
  let path = req.query.path;
  if (path[0] === '/') path = path.slice(1);
  if (path[path.length - 1] === '/') path = path.slice(0, path.length - 1);
  if (path && !path.includes(config.staticFolder)) path = config.staticFolder + '/' + path;
  path = path.replaceAll('/', '\\');
  const file = await fileService.getFileByPath(path, req.headers[config.headers.PrjID]);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  res.send(file);
});

const uploadSingle = catchAsync(async (req, res) => {
  const file = req.file;
  res.send(file);
});

const uploadMulti = catchAsync(async (req, res) => {
  const files = req.files;
  res.send(files);
});

module.exports = {
  getDirectories,
  getFileByDestination,
  getFileByPath,
  uploadSingle,
  uploadMulti,
};
