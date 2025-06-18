const Joi = require('joi');
const { objectId } = require('../custom.validation');

const body = {
  routePath: Joi.string().custom(objectId).required(),
  screen: Joi.string().custom(objectId).required(),
};

const createRoutePathScreen = {
  body: Joi.object().keys({
    ...body,
  }),
};

const createMultipleRoutePathScreen = {
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object().keys({
        ...body,
      })
    ),
  }),
};

const getPathByScreenId = {
  params: Joi.object().keys({
    screenId: Joi.string().custom(objectId).required(),
  }),
};

const getPathByRoutePathId = {
  params: Joi.object().keys({
    routePathId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createRoutePathScreen,
  createMultipleRoutePathScreen,
  getPathByScreenId,
  getPathByRoutePathId,
};
