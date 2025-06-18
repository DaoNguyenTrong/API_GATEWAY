const Joi = require('joi');
const { objectId } = require('../custom.validation');

const body = Joi.object()
  .keys({
    id: Joi.string().allow('').allow(null),
    method: Joi.string().allow('').allow(null).default(null),
    path: Joi.string().required(),
    name: Joi.string().required(),
    isProxy: Joi.boolean().default(false),
    description: Joi.string().allow('').allow(null).default(null),
    isActive: Joi.boolean().default(true),
    host: Joi.string().allow('').allow(null).default(null),
    parentId: Joi.string().custom(objectId).allow('').allow(null).default(null),
    limit: Joi.number().allow('').allow(null).default(null),
    windowMs: Joi.number().allow('').allow(null).default(null),
  })
  .unknown(true);

const createRoutePath = {
  body,
};

const getRoutePathById = {
  params: Joi.object().keys({
    routePathId: Joi.string().required().custom(objectId),
  }),
};

const paginateRoutePath = {
  query: Joi.object().keys({
    keyword: Joi.string().allow('').allow(null),
    status: Joi.boolean().allow(null),
    method: Joi.string().allow('').allow(null),
    path: Joi.string().allow('').allow(null),
    name: Joi.string().allow('').allow(null),
    isProxy: Joi.boolean().allow('').allow(null),
    isActive: Joi.boolean().allow('').allow(null),
    description: Joi.string().allow('').allow(null),
    sortBy: Joi.string().allow('').allow(null),
    descending: Joi.boolean().allow('').allow(null),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateRoutePathById = {
  params: Joi.object().keys({
    routePathId: Joi.string().required().custom(objectId),
  }),
  body,
};

const deleteRoutePathById = {
  params: Joi.object().keys({
    routePathId: Joi.string().required().custom(objectId),
  }),
};

const getPathChildren = {
  params: Joi.object().keys({
    routePathId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createRoutePath,
  getRoutePathById,
  updateRoutePathById,
  deleteRoutePathById,
  paginateRoutePath,
  getPathChildren,
};
