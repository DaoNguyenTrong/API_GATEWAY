const webPush = require('web-push');
const config = require('../../config/config');
const { Subscription } = require('../../models/index');
const { accountService } = require('../index');

const publicVapidKey = config.webPush.public;
const privateVapidKey = config.webPush.private;

/* It sets the VAPID details for the web push library. */
webPush.setVapidDetails('mailto:dao12a2@gmail.com', publicVapidKey, privateVapidKey);

/**
 * It takes a subscription, payload, and options, and returns a promise that resolves when the
 * notification has been sent
 * @param {object} subscription - The subscription object that you get from the client.
 * @param {object} payload - The data you want to send to the client.
 * @param {object} options - An object containing the following properties:
 * @returns {Promise} The promise returned by webPush.sendNotification.
 */
function sendNotification(subscription, payload, options = {}) {
  return webPush.sendNotification(subscription, JSON.stringify(payload), options);
}

/**
 * It creates a new subscription in the database and returns it.
 * @param {ObjectId} userId - The user's ID
 * @param {object} subscription - The subscription object that you get from the client.
 * @returns {Promise<Subscription>} The subscription object
 */
async function subscriptionHandler(userId, subscription) {
  const sub = await Subscription.create({ userId, subscription });
  return sub;
}

/**
 * This function returns a promise that resolves to an array of subscriptions for a given userId.
 * @param {string} userId - The userId of the user you want to get the subscription for.
 * @returns {Promise<Array<Subscription>>} An array of subscriptions.
 */
async function getSubScriptionByUserId(userId) {
  const subs = await Subscription.find({ userId });
  return subs;
}

/**
 * Get all the subscriptions from the database that match the filter criteria.
 * @param {object} [filter] - {
 * @returns {Promise<Array<Subscription>>} An array of subscriptions.
 */
async function getSubScriptions(filter = {}) {
  const subs = await Subscription.find(filter);
  return subs;
}

/**
 * It finds a subscription by a filter, removes it, and returns the removed subscription.
 * @param {object} [filter] - The filter object to find the subscription to remove.
 * @returns {Promise<Subscription>} The subscription that was removed.
 */
async function removeSubscription(filter = {}) {
  await Subscription.deleteOne(filter);
}

async function sendNotificationToUsers(users, payload, options) {
  const userFilter = { _id: { $in: users }, status: true };
  const listUsers = await accountService.getAccounts(userFilter);
  const userIds = listUsers.map((item) => item.id);
  const filter = {};
  if (userIds.length) {
    filter.$or = [];
  }
  userIds.forEach((item) => {
    filter.$or.push({ userId: item });
  });
  const subscriptions = await getSubScriptions(filter);
  const promises = [];
  subscriptions.forEach((item) => {
    promises.push(sendNotification(item.subscription, payload, options));
  });
  await Promise.allSettled(promises);
}

module.exports = {
  sendNotification,
  subscriptionHandler,
  getSubScriptionByUserId,
  getSubScriptions,
  removeSubscription,
  sendNotificationToUsers,
};
