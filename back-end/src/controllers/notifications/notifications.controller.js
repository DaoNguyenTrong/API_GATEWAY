const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { webPushService, accountService } = require('../../services/index');
const ApiError = require('../../utils/ApiError');

const subscription = catchAsync(async (req, res) => {
  const user = req.user;
  const sub = await webPushService.subscriptionHandler(user.id, req.body.subscription);
  res.status(httpStatus.CREATED).send(sub);
});

const sendNotificationToUser = catchAsync(async (req, res) => {
  const user = accountService.getAccountById(req.params.userId);
  if (!user.status) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This account is blocked');
  }
  const subscriptions = await webPushService.getSubScriptions({ userId: req.params.userId });
  const promises = [];
  subscriptions.forEach((item) => {
    promises.push(webPushService.sendNotification(item.subscription, req.body.payload));
  });
  await Promise.allSettled(promises);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendNotificationToUsers = catchAsync(async (req, res) => {
  const userIds = req.body.userIds;
  webPushService.sendNotificationToUsers(userIds, req.body.payload);
  res.status(httpStatus.NO_CONTENT).send();
});

const removeSubscription = catchAsync(async (req, res) => {
  const endpoint = req.query.endpoint;
  const filter = { 'subscription.endpoint': endpoint };
  await webPushService.removeSubscription(filter);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { subscription, sendNotificationToUser, sendNotificationToUsers, removeSubscription };
