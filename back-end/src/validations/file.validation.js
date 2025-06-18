const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getDirectories = {
  query: Joi.object().keys({
    destination: Joi.string().required().allow(''),
  }),
};

const getFileByDestination = {
  query: Joi.object().keys({
    destination: Joi.string().required().allow(''),
  }),
};

const getFileByPath = {
  query: Joi.object().keys({
    path: Joi.string().required().allow(''),
  }),
};

module.exports = {
  getDirectories,
  getFileByDestination,
  getFileByPath,
};
