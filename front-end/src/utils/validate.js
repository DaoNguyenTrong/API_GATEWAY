import { t } from "i18next";

/**
 * Created by PanJiaChen on 16/11/18.
 * Modify 08/09/2022
 */

/**
 *
 * @param {object} rule
 * @param {string} value
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function isExternal(rule, value) {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(value);
}

/**
 * Usernames can contain characters a-z, 0-9, underscores and periods
 * The username cannot start with a period nor end with a period
 * It must also not have more than one period sequentially
 * Max length is 30 chars
 * @param {object} rule
 * @param {string} value
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validUsername(rule, value, callback) {
  const reg = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
  return reg.test(value) || callback(new Error(t("Invalid username")));
}

/**
 * Password should be at least one capital letter
 * One small letter
 * One number and 8 character length
 * @param {object} rule
 * @param {string} value
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validPassword(rule, value, callback) {
  const reg = /^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
  return reg.test(value) || callback(new Error(t("Invalid password")));
}

/**
 *
 * @param {object} rule
 * @param {string} url
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validURL(rule, url, callback) {
  if (!url) return true;
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url) || callback(new Error(t("Invalid URL")));
}

/**
 *
 * @param {object} rule
 * @param {string} str
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validLowerCase(rule, str, callback) {
  const reg = /^[a-z]+$/;
  return reg.test(str) || callback(new Error(t("Accept lowercase only")));
}

/**
 *
 * @param {object} rule
 * @param {string} str
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validUpperCase(rule, str, callback) {
  const reg = /^[A-Z]+$/;
  return reg.test(str) || callback(new Error(t("Accept uppercase only")));
}

/**
 *
 * @param {object} rule
 * @param {string} str
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validAlphabetsOrNumber(rule, str, callback) {
  const reg = /^[a-zA-Z0-9]+$/;
  return (
    reg.test(str) || callback(new Error(t("Accept alphabets or number only")))
  );
}

/**
 *
 * @param {object} rule
 * @param {string} email
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function validEmail(rule, email, callback) {
  if (!email) return true;
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email) || callback(new Error(t("Invalid email")));
}

/**
 *
 * @param {object} rule
 * @param {string} str
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function isString(rule, str, callback) {
  if (typeof str === "string" || str instanceof String) {
    return true;
  }
  return false || callback(new Error(t("Accept text only")));
}

/**
 *
 * @param {object} rule
 * @param {any} arg
 * @param {Callback} callback
 * @returns {Boolean || Callback}
 */
export function isArray(rule, arg, callback) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg) || callback(new Error("Not an array"));
}

export const requiredRule = {
  required: true,
  message: () => t("Required field"),
  trigger: "change",
};

export const requiredRuleBlur = {
  required: true,
  message: () => t("Required field"),
  trigger: "blur",
};

export const URLRule = { validator: validURL, trigger: "blur" };

export const usernameRule = { validator: validUsername, trigger: "blur" };

export const passwordRule = { validator: validPassword, trigger: "blur" };

export const emailRule = { validator: validEmail, trigger: "blur" };

export const numberRule = {
  type: "number",
  message: () => t("Must be a number"),
};

export const validateForm = async (refForm) => {
  try {
    const res = await refForm.validate();
    return res;
  } catch (error) {
    console.error(error);
    throw "Validation";
  }
};
