import config from "@/configs/constant";
import { messageError } from "./message";
import versions from "@/versions.json";

const current = getCurrentVersion(versions);
const title = config.appTitle || "Vue 3 code base";

/**
 * Create document title
 * @param {string} pageTitle
 * @returns {string}
 */
export function getPageTitle(pageTitle) {
  if (pageTitle) return `${pageTitle} - ${title} ${current.tag}`;
  return `${title}`;
}

/**
 * Report jwt token parser
 */
export function parseToken(token) {
  if (!token) return {};
  var base64Url = token?.split(".")[1];
  var base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

/**
 * Create image source with token query parameter
 * @param {string} uri
 * @param {string} destination
 * @param {string} token
 * @returns {string}
 */
export function buildImageSrcWithAuth(uri, destination, token) {
  return `${uri}/${destination}?token=${token}`;
}

/**
 *
 * @param {string} accept
 * @param {boolean=} multiple
 * @param {function} callback
 * @returns {FileList <File>}
 */
export function pickFile(accept = "", multiple = false, callback) {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.onchange = (e) => {
    var files = e.target.files;
    if (multiple) callback(files);
    else callback(files[0]);
  };
  input.click();
  input.remove();
}

/**
 * Get current app version
 * @param {Array} versions List versions in version.json
 * @returns
 */
export function getCurrentVersion(versions = []) {
  const defaultVersion = {
    tag: "1.0.0",
    description: "",
    change: [],
    added: [],
    Fixed: [],
  };
  return versions[0] || defaultVersion;
}

/**
 * It takes an array of promises, waits for them to resolve, and then returns an array of objects that
 * contain the status of each promise.
 * @param {array} [promises] - An array of promises.
 * @returns {Promise} An array of objects.
 */
export async function promiseAllSettled(promises = []) {
  const result = await Promise.allSettled(promises);
  result.forEach((item) => {
    if (item.status === "rejected") {
      messageError(item.reason.message);
    }
  });
  return result;
}

export function getRootDomain(url) {
  if (typeof url === "string") url = new URL(url);

  const domain = url.hostname;
  const elements = domain.split(".");
  const iMax = elements.length - 1;

  const elem1 = elements[iMax - 1];
  const elem2 = elements[iMax];

  const isSecondLevelDomain = iMax >= 3 && (elem1 + elem2).length <= 5;
  return (
    (isSecondLevelDomain ? elements[iMax - 2] + "." : "") + elem1 + "." + elem2
  );
}

/**
 * The function searches for a compare string within a root string, ignoring case sensitivity.
 * @param {String} rootString - The main string that we want to search within.
 * @param {String} compareString - The string that we want to search for within the rootString.
 * @returns {Boolean} The function `searchString` is being returned.
 */
export function searchString(rootString, compareString) {
  return rootString.toLowerCase().includes(compareString.toLowerCase());
}
