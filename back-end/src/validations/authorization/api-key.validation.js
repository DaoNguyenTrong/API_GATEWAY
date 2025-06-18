const Joi = require('joi');
const { objectId } = require('../custom.validation');

const body = {
  id: Joi.string().custom(objectId).allow('').allow(null),
  key: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow('').allow(null),
  expiredDate: Joi.date().allow('').allow(null),
  status: Joi.boolean().allow('').allow(null),
  createdBy: Joi.string().custom(objectId).allow('').allow(null),
};

const createApiKey = {
  body: Joi.object()
    .keys({
      ...body,
    })
    .unknown(true),
};

const paginateApiKeys = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(''),
    status: Joi.number().allow('').allow(null),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    descending: Joi.boolean(),
  }),
};

const getApiKeyById = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

const updateApiKey = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    ...body,
  }),
};

const deleteApiKey = {
  params: Joi.object().keys({
    apiKeyId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createApiKey,
  paginateApiKeys,
  getApiKeyById,
  updateApiKey,
  deleteApiKey,
};
