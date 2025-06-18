import { t } from "i18next";
import { boxError, messageError } from "./message";

export function errorHandler(error) {
  // Log error is not axios error
  if (error !== "cancel" && error !== "Validation") {
    showErrorMessage(error);
  }
  if (error !== "cancel") {
    throw error;
  }
  return true;
}

const showErrorMessage = (error) => {
  if (error?.response?.data) {
    const data = error?.response?.data;
    if (typeof data === "string") {
      messageError(data);
    } else if (data.Message) {
      messageError(data.Message);
    } else if (data.title) {
      messageError(data.title);
    } else {
      messageError(t("Unknown error"));
    }
  } else {
    if (error.cause === "messageBox") {
      boxError(error.message || error);
    } else {
      messageError(error.message || error);
    }
  }
};
