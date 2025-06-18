const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createRole = {
  body: Joi.object().keys({
    role: Joi.object(),
    screens: Joi.array(),
  }),
};

const getRoleById = {
  params: Joi.object().keys({
    roleId: Joi.required().custom(objectId),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    roleId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    role: Joi.object(),
    screens: Joi.array(),
  }),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createRole,
  updateRole,
  getRoleById,
  deleteRole,
};
