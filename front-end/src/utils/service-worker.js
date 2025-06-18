import { t } from "i18next";
import constant from "@/configs/constant";

/**
 * It takes a base64 encoded string and converts it to a Uint8Array
 * @param {string} base64String - The public key you get from the server.
 * @returns an array of 8-bit unsigned integers.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * It registers the service worker, then subscribes the user to push notifications.
 * @returns The subscription object.
 */
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    const register = await navigator.serviceWorker.ready;
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(constant.publicVapidKey),
    });
    return subscription;
  } else {
    throw new Error(t("Service worker is not supported"));
  }
}

/**
 * It gets all the service workers registered to the current page, and unregister them
 */
export async function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      registration.unregister();
    }
  }
}
