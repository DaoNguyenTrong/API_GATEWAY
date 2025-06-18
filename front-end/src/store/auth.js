import { defineStore } from "pinia";
import api from "@/api/index";
import storage from "@/storage/index";
import { ref, computed } from "vue";
import { parseToken } from "@/utils/index";
import config from "@/configs/constant";
import router from "@/router";
import constant from "@/configs/constant";

export const useAuthStore = defineStore("authStore", () => {
  const userInform = ref({}),
    getTokenInterval = ref(null),
    roles = ref([]);

  /**
   * It takes in a username, password, and a boolean value, and returns a response from the API.
   * @param {string} [username] - string
   * @param {string} [password] - "123456"
   * @param {boolean} [keepLogin=false] - boolean
   * @returns {Promise} The response from the API.
   */
  async function login(username = "", password = "", keepLogin = false) {
    const res = await api.auth.login(username, password);
    const now = new Date().getTime();
    const tokenExpires = new Date(res.tokens.access.expires).getTime();
    let refreshTokenExpires = new Date(res.tokens.refresh.expires).getTime();
    // write to state

    // write to storage
    storage.cookies.setToken(
      res.tokens.access,
      (tokenExpires - now) / 86400000
    );
    storage.cookies.setRefreshToken(
      res.tokens.refresh,
      keepLogin ? (refreshTokenExpires - now) / 86400000 : undefined
    );
    storage.local.setInform(res.user);
    return res;
  }

  /**
   * Send logout api, remove token, refresh token and user information
   * @returns {Promise<Response.data>}
   */
  async function logout() {
    try {
      const refreshToken = storage.cookies.getRefreshToken();
      if (refreshToken.token) {
        await api.auth.logout(refreshToken.token || "");
      }
    } catch (error) {
      console.error(error);
    }
    storage.cookies.removeToken();
    storage.cookies.removeRefreshToken();
    storage.local.removeInform();
    router.replace({ path: "/login" });
  }

  async function redirectToPortal() {
    const mode = constant.nodeEnv;
    if (mode === constant.development) {
      router.replace({ path: "/login" });
    } else {
      let url = location.origin;
      location.replace(url);
    }
  }

  /**
   * Get user information
   */
  async function getInfo() {
    const res = await api.user.getInfo();
    userInform.value = { ...res };
    return res;
  }

  async function updateInfo(body) {
    const res = await api.user.updateInfo(body);
    userInform.value = { ...res };
    return res;
  }

  /**
   * Remove dynamic routes
   */
  function removeAsyncRoutes() {
    const routes = router.getRoutes();
    routes.forEach((route) => {
      if (route.meta && route.meta.sync) {
        router.removeRoute(route.name);
      }
    });
  }

  /**
   * Refresh current token by refresh token
   * @returns {Promise<Response.data>}
   */
  async function getNewToken() {
    try {
      const refresh = storage.cookies.getRefreshToken();
      const res = await api.auth.refreshToken(refresh.token || "");

      const now = new Date().getTime();
      const tokenExpires = new Date(res.access.expires).getTime();
      const refreshTokenExpires = new Date(res.refresh.expires).getTime();
      storage.cookies.setToken(res.access, (tokenExpires - now) / 86400000);
      storage.cookies.setRefreshToken(
        res.refresh,
        (refreshTokenExpires - now) / 86400000
      );
      return res;
    } catch (error) {
      await logout();
    }
  }

  /**
   * Refresh token 1 hour before expires
   */
  function refreshTokenTimer() {
    checkToken();
    getTokenInterval.value = setInterval(() => {
      checkToken();
    }, 300000);
  }

  function checkToken() {
    let tk = storage.cookies.getToken();
    let rf = storage.cookies.getRefreshToken();
    if (!tk && rf) {
      getNewToken();
    }
    let expireDate = tk.expires;
    if (!expireDate) return;
    let remaining = new Date(expireDate).getTime() - new Date().getTime();
    if (remaining <= 300000) getNewToken();
  }

  function clearGetTokenInterval() {
    clearInterval(getTokenInterval.value);
    getTokenInterval.value = null;
  }

  /**
   * Get user's roles right from token decoder
   * @returns {Array<roles>}
   */
  function getRoleFromToken() {
    const token = storage.cookies.getToken();
    const obj = (token && parseToken(token?.token)) || {};
    roles.value = obj.roles || [];
    return roles.value;
  }

  /**
   * Get user id from token
   * @param {string} token
   * @returns {String} User id
   */
  function getUserId(token) {
    console.log(token);
    const obj = parseToken(token);
    return obj.sid || "";
  }

  function makeFileUrl(destination) {
    const token = storage.cookies.getToken();
    const baseUrl = config.authApi;
    const url = `${baseUrl}/${destination}?token=${token.token}`;
    return url;
  }

  const token = computed(() => {
    return storage.cookies.getToken();
  });

  const refreshToken = computed(() => {
    return storage.cookies.getRefreshToken();
  });

  return {
    token,
    refreshToken,
    userInform,
    roles,
    refreshTokenTimer,
    login,
    logout,
    getNewToken,
    getRoleFromToken,
    makeFileUrl,
    clearGetTokenInterval,
    getUserId,
    getInfo,
    updateInfo,
  };
});
