import constant from "@/configs/constant";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { t } from "i18next";
/**
 * Show successful message
 * @param {string} message
 * @returns {ElMessage.success}
 */
export function messageSuccess(message = t("success")) {
  return ElMessage.success({
    message: message,
    grouping: true,
  });
}

/**
 * Show error message
 * @param {string} message
 * @returns {ElMessage.error}
 */
export function messageError(message = t("error")) {
  return ElMessage.error({
    message: message,
    grouping: true,
  });
}

/**
 * Show warning message
 * @param {string} message
 * @returns {ElMessage.warning}
 */
export function messageWarning(message = t("warning")) {
  return ElMessage.warning({
    message: message,
    grouping: true,
  });
}

/**
 * Show information message
 * @param {string} message
 * @returns {ElMessage.info}
 */
export function messageInform(message = t("inform")) {
  return ElMessage.info({
    message: message,
    grouping: true,
  });
}

/**
 * Show confirm box
 * @param {String} message
 * @returns {ElMessageBox.confirm}
 */
export async function mainConfirm(message = t("Confirm")) {
  const res = await ElMessageBox.confirm(message, t("Confirm"), {
    confirmButtonText: t("Confirm"),
    cancelButtonText: t("Cancel"),
    type: "info",
    draggable: true,
  });
  return res;
}

/**
 * Show successfully notification
 * @param {String} message
 * @returns {ElNotification.success}
 */
export function notifySuccess(message = t("Successfully")) {
  return ElNotification.success({
    message,
    title: t("Success"),
    position: "bottom-right",
  });
}

/**
 * Show warning notification
 * @param {String} message
 * @returns {ElNotification.warning}
 */
export function notifyWarning(message = t("Warning")) {
  return ElNotification.warning({
    message,
    title: t("Warning"),
    position: "bottom-right",
  });
}

/**
 * Show information notification
 * @param {String} message
 * @returns {ElNotification.info}
 */
export function notifyInform(message = t("Information")) {
  return ElNotification.info({
    message,
    title: t("Information"),
    position: "bottom-right",
  });
}

/**
 * Show error notification
 * @param {String} message
 * @returns {ElNotification.error}
 */
export function notifyError(message = t("Error")) {
  return ElNotification.error({
    message,
    title: t("Error"),
    position: "bottom-right",
  });
}

export const boxError = async (message, title) => {
  return ElMessageBox.alert(message, title, {
    confirmButtonText: "OK",
    type: "error",
  });
};

/**
 * The `boxConfirm` function is an asynchronous function that displays a confirmation message box with
 * customizable text and buttons, and returns a promise that resolves to the user's response.
 * @param {string} [message] - The message parameter is the text that will be displayed in the confirmation box.
 * It is optional and defaults to the translation of the word "Confirm".
 * @returns {Promise<MessageBoxData>} the result of the confirmation dialog box.
 */
export async function boxConfirm(message = t("Confirm")) {
  const res = await ElMessageBox.confirm(message, t("Confirm"), {
    confirmButtonText: t("Confirm"),
    cancelButtonText: t("Cancel"),
    type: "warning",
    draggable: true,
  });
  return res;
}
