import router from "@/router";
import { usePermissionStore, useAuthStore } from "@/store";
import NProgress from "nprogress";
import "@/styles/utils/nprogress.scss";
import { getToken } from "./storage/cookies";
import { getPageTitle } from "./utils";
import { t } from "i18next";
import api from "@/api/index";
import { getRefreshToken } from "@/storage/cookies";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  const authStore = useAuthStore();
  // Start progress bar
  NProgress.start();

  // Set page title
  document.title = getPageTitle(t(to.meta.title));
  if (!getToken().token && getRefreshToken().token) {
    try {
      await authStore.getNewToken();
    } catch (error) {
      authStore.logout();
      NProgress.done();
    }
  }
  if (!getToken().token && !getRefreshToken().token) {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
      NProgress.done();
    } else {
      const fullUrl = window.location.href;
      const encodedUrl = encodeURIComponent(fullUrl);
      authStore.logout();
      window.location.href = `/#/login?redirect=${encodedUrl}`;
      return;
    }
  } else if (to.path === "/login") {
    next({ path: "/" });
    NProgress.done();
  } else {
    // Determine whether the user has obtained his permission roles from token parser
    const hasRoles = authStore.roles && authStore.roles.length > 0;

    if (hasRoles) {
      next();
    } else {
      const token = getToken();
      const userId = authStore.getUserId(token?.token || "");
      await authStore.getInfo();
      const screens = await api.user.getScreenById(userId);
      const roles = screens.map((screen) => screen.screen.action);
      if (roles.length === 0) {
        await authStore.logout();
      } else {
        authStore.roles = roles;
        const accessRoutes = await permissionStore.generateRoutes(roles);
        // dynamically add accessible routes
        accessRoutes.forEach((route) => {
          router.addRoute(route);
        });

        next({ ...to, replace: true });
        NProgress.done();
      }
    }
  }
});

router.afterEach(() => {
  // Finish progress bar
  NProgress.done();
});
