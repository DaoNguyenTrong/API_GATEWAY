import axios from "axios";
import { useAuthStore, useSettingsStore } from "@/store/index";
import router from "@/router/index";
import { messageError } from "@/utils/message";
import NProgress from "nprogress";
import "@/styles/utils/nprogress.scss";
import constant from "@/configs/constant";
import { getToken, getRefreshToken } from "@/storage/cookies";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];
const whiteListApis = ["/auth/login", "/auth/refresh-tokens", "/auth/logout"];

// create an axios instance
const service = axios.create({
  baseURL: constant.authApi, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  async (config) => {
    NProgress.start();
    const auth = useAuthStore();
    const settings = useSettingsStore();
    // do something before request is sent
    // Add Bearer authorization token
    const refreshToken = getRefreshToken();
    if (!whiteListApis.some((item) => config.url.includes(item))) {
      let token = getToken();
      if (token.token || refreshToken.token) {
        if (!token.token) {
          await auth.getNewToken();
          token = getToken();
        }
        config.headers.Authorization = "Bearer ".concat(token.token);
      }
    }
    config.paramsSerializer;
    // Add accept language
    if (settings.language) {
      config.headers["Accept-Language"] = settings.language;
    } else {
      config.headers["Accept-Language"] = "vi";
    }
    return config;
  },
  (error) => {
    NProgress.done();
    // do something with request error
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    NProgress.done();
    return response.data;
  },
  async (error) => {
    const auth = useAuthStore();
    /**
     * Logout if route out of whitelist
     */
    if (error.response && error.response.status === 401) {
      if (whiteList.indexOf(router.currentRoute.value.path) === -1) {
        await auth.logout();
      }
    }
    /**
     * Show error message
     */
    if (error.response && error.response.data) {
      messageError(error.response.data.message);
    } else {
      messageError(error.message);
    }
    NProgress.done();
    return Promise.reject(error);
  }
);

export default service;
