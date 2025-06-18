const Joi = require('joi');
const { objectId } = require('../custom.validation');

const subscription = {
  body: Joi.object().keys({
    subscription: Joi.object().required(),
  }),
};

const sendNotificationToUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    payload: Joi.object().required(),
  }),
};

const sendNotificationToUsers = {
  body: Joi.object().keys({
    userIds: Joi.array().items(Joi.string().custom(objectId)),
    payload: Joi.object().required(),
  }),
};

const removeSubscription = {
  query: Joi.object().keys({
    endpoint: Joi.string(),
  }),
};

module.exports = { subscription, sendNotificationToUser, sendNotificationToUsers, removeSubscription };
