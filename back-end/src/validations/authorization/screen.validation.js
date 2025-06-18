const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createScreen = {
  body: Joi.object().keys({
    action: Joi.string().required(),
    name: Joi.string().required(),
    parent: Joi.string().custom(objectId).allow(null),
    isTool: Joi.boolean(),
    url: Joi.string().allow('').allow(null),
    icon: Joi.string().allow('').allow(null),
    color: Joi.string().allow('').allow(null),
  }),
};

const getScreenById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateScreenById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    action: Joi.string().required(),
    name: Joi.string().required(),
    parent: Joi.string().custom(objectId).allow(null),
    locked: Joi.boolean(),
    isTool: Joi.boolean(),
    url: Joi.string().allow('').allow(null),
    icon: Joi.string().allow('').allow(null),
    color: Joi.string().allow('').allow(null),
  }),
};

const deleteScreenById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = { createScreen, getScreenById, updateScreenById, deleteScreenById };
