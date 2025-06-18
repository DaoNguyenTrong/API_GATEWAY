const Joi = require('joi');
const { password, objectId } = require('../custom.validation');

const createAccount = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().allow(''),
    password: Joi.string().required().custom(password),
    name: Joi.string().allow(''),
    roleId: Joi.string().custom(objectId).required(),
    phone: Joi.string().allow(''),
    position: Joi.string().allow(''),
    address: Joi.string().allow(''),
    avatar: Joi.object(),
    PrjID: Joi.array().allow(null),
    accessAllProject: Joi.boolean(),
  }),
};

const getAccounts = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(''),
    roleId: Joi.string().allow('').custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAccount = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateAccount = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().allow(''),
      name: Joi.string().allow(''),
      roleId: Joi.string().custom(objectId).required(),
      phone: Joi.string().allow(''),
      position: Joi.string().allow(''),
      address: Joi.string().allow(''),
      avatar: Joi.object(),
      createdBy: Joi.string(),
      PrjID: Joi.array().allow(null),
      accessAllProject: Joi.boolean(),
    })
    .min(1),
};

const changeStatus = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.boolean().required(),
  }),
};

const changeUserPassword = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const deleteAccount = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateInfo = {
  body: Joi.object().keys({
    name: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    position: Joi.string().allow(''),
    address: Joi.string().allow(''),
    avatar: Joi.object(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    oldPassword: Joi.string(),
  }),
};

module.exports = {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  changeStatus,
  changeUserPassword,
  deleteAccount,
  updateInfo,
  changePassword,
};
