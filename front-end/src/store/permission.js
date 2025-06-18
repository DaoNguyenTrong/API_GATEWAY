import { asyncRoutes, constantRoutes } from "@/router";
import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { allRoles } from "@/configs/roles";

/**
 * Use meta.role to determine if the current user has permission
 * @param {Array} roles
 * @param {String} route
 * @returns {Boolean}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param {Array} routes
 * @param {Array} roles
 * @returns {Array}
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

function addSyncTag(routes) {
  return routes.map((item) => {
    if (item.children) {
      item.children = addSyncTag(item.children);
    }
    if (item.meta) {
      item.meta.sync = true;
    }
    return item;
  });
}

export const usePermissionStore = defineStore("permissionStore", () => {
  const routes = shallowRef([]);
  const addRoutes = shallowRef([]);

  function generateRoutes(roles) {
    return new Promise((resolve) => {
      let accessedRoutes;
      if (roles.includes(allRoles.admin)) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      accessedRoutes = addSyncTag(accessedRoutes);
      addRoutes.value = accessedRoutes;
      routes.value = constantRoutes.concat(accessedRoutes);
      resolve(accessedRoutes);
    });
  }

  return {
    routes,
    addRoutes,
    generateRoutes,
  };
});
