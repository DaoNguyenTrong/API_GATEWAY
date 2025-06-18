import request from "@/utils/request";
import constant from "@/configs/constant";
import { Axios } from "axios";

const version = constant.apiVersion;

/**
 * It takes a subscription object and sends it to the server.
 *
 * The subscription object is a JSON object that contains the following properties:
 *
 * - endpoint
 * - keys
 * - auth
 * - p256dh
 *
 * The endpoint property is a URL that identifies the server that will send the push messages.
 *
 * The keys property is an object that contains two properties:
 *
 * - p256dh
 * - auth
 *
 * The p256dh property is a string that contains the public key that the server will use to encrypt the
 * push messages.
 *
 * The auth property is a string that contains the authentication secret that the server will use to
 * encrypt the push messages.
 *
 * The auth property is a string that contains the authentication secret that the server will use to
 * encrypt the push messages.
 *
 * The p256dh property is a
 * @param {object} subscription - The subscription object returned by the browser.
 * @returns {Axios.post} A promise.
 */
function subscribeNotification(subscription) {
  return request.post(`/${version}/notification/subscription`, {
    subscription,
  });
}

/**
 * It sends a notification to a list of users
 * @param {array} userIds - An array of user IDs to send the notification to.
 * @param {object} payload - The payload to send to the user.
 * @returns {Axios.post} a promise.
 */
function sendNotificationToUsers(userIds, payload) {
  return request.post(`/${version}/notification`, { userIds, payload });
}

/**
 * This function will send a POST request to the server to unsubscribe a user from a notification
 * @param {string} endpoint - The endpoint of the subscription to unsubscribe from.
 * @returns {Axios.post} A promise.
 */
function unsubscribeNotification(endpoint) {
  return request.delete(`/${version}/notification/subscription`, {
    params: { endpoint },
  });
}

export default {
  subscribeNotification,
  sendNotificationToUsers,
  unsubscribeNotification,
};
