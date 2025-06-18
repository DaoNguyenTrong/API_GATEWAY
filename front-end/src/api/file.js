import request from "@/utils/request";
import config from "@/configs/constant";
import { useAuthStore } from "@/store/index";
import { objectPick } from "@vueuse/shared";

const version = config.apiVersion;
const formDataConfig = config.formData;

/**
 * Upload single file
 * @param {binary} file
 * @param {string} projectId
 * @returns {Axios.request}
 */
export function uploadSingle(file, projectId) {
  return request.post(
    `/${version}/file/single`,
    { file, projectId },
    formDataConfig
  );
}

/**
 * Upload multiple files
 * @param {Array<binary>} files
 * @param {string} projectId
 * @returns {Axios.request}
 */
export function uploadMulti(list, projectId) {
  return request.post(
    `/${version}/file/any`,
    { list, projectId },
    formDataConfig
  );
}

/**
 * Upload file array
 * @param {Object} file
 * @param {String} projectId
 */
export function uploadArray(files, projectId) {
  const formData = new FormData();
  formData.append("projectId", projectId);
  files.forEach((file) => {
    formData.append(file, file.raw ? file.raw : file);
  });
  return request.post(`/${version}/file/any`, formData);
}

/**
 * Download file with path
 * @param {string} path
 * @returns {Axios.request}
 */
export function downloadFile(path) {
  const auth = useAuthStore();
  const token = auth.token.token;
  return request.get(`/${path}?token=${token}`, {
    responseType: "blob", // Important
  });
}

export default {
  uploadSingle,
  uploadMulti,
  downloadFile,
  uploadArray,
};
