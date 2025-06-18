const Joi = require('joi');

const { objectId } = require('../custom.validation');

const body = {
  apiKey: Joi.string().custom(objectId).required(),
  screen: Joi.string().custom(objectId).required(),
};

const deleteApiKeyScreen = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

const getApiKeyScreenByApiKeyId = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

const createApiKeyScreen = {
  body: Joi.object().keys({
    ...body,
  }),
};

const createMultipleApiKeyScreen = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object().keys({
        ...body,
      })
    ),
  }),
};

const getApiKeyScreens = {
  query: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

const deleteApiKeyScreenByApiKeyId = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

const getScreenByApiKey = {
  params: Joi.object().keys({
    apiKey: Joi.string().required(),
  }),
};

module.exports = {
  createApiKeyScreen,
  createMultipleApiKeyScreen,
  getApiKeyScreenByApiKeyId,
  getApiKeyScreens,
  deleteApiKeyScreenByApiKeyId,
  getScreenByApiKey,
  deleteApiKeyScreen,
};
