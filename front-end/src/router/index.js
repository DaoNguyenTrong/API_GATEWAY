import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "@/views/not-found/index.vue";
import Layouts from "@/components/layouts/index.vue";
import { allRoles } from "@/configs/roles";
import constant from "@/configs/constant";

export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views//home/index.vue"),
        meta: {
          title: "Dashboard",
          icon: "dashboard",
        },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
const routes = [
  {
    path: "/roles",
    component: Layouts,
    redirect: "/roles/list",
    name: "Roles",
    meta: {
      roles: [
        allRoles.role.view,
        allRoles.role.create,
        allRoles.role.update,
        allRoles.role.delete,
      ],
      async: true,
    },
    children: [
      {
        path: "list",
        name: "ListRoles",
        component: () => import("@/views/roles/index.vue"),
        meta: {
          title: "Group permissions and tools",
          icon: "roles",
          roles: [
            allRoles.role.view,
            allRoles.role.create,
            allRoles.role.update,
            allRoles.role.delete,
          ],
          async: true,
        },
      },
    ],
  },
  {
    path: "/api-key",
    component: Layouts,
    redirect: "/api-key/list",
    name: "ApiKey",
    meta: {
      roles: [
        allRoles.apiKey.view,
        allRoles.apiKey.create,
        allRoles.apiKey.update,
        allRoles.apiKey.delete,
      ],
      async: true,
    },
    children: [
      {
        path: "list",
        name: "ListApiKey",
        component: () => import("@/views/api-key/index.vue"),
        meta: {
          title: "API Key management",
          icon: "api-key",
          roles: [
            allRoles.apiKey.view,
            allRoles.apiKey.create,
            allRoles.apiKey.update,
            allRoles.apiKey.delete,
          ],
          async: true,
        },
      },
    ],
  },
  {
    path: "/route-paths",
    component: Layouts,
    redirect: "/route-paths/list",
    name: "RoutePaths",
    meta: {
      roles: [
        allRoles.routePath.view,
        allRoles.routePath.create,
        allRoles.routePath.update,
        allRoles.routePath.delete,
      ],
      async: true,
    },
    children: [
      {
        path: "list",
        name: "ListRoutePaths",
        component: () => import("@/views/route-paths/index.vue"),
        meta: {
          title: "Route paths",
          icon: "route",
          roles: [
            allRoles.routePath.view,
            allRoles.routePath.create,
            allRoles.routePath.update,
            allRoles.routePath.delete,
          ],
          async: true,
        },
      },
    ],
  },

  {
    path: "/accounts",
    component: Layouts,
    redirect: "/accounts/list",
    name: "Accounts",
    meta: {
      roles: [
        allRoles.user.view,
        allRoles.user.create,
        allRoles.user.changePassword,
        allRoles.user.changeStatus,
        allRoles.user.delete,
        allRoles.user.resetPassword,
        allRoles.user.update,
      ],
      async: true,
    },
    children: [
      {
        path: "list",
        name: "ListAccounts",
        component: () => import("@/views/accounts/index.vue"),
        meta: {
          title: "Accounts management",
          icon: "users",
          roles: [
            allRoles.user.view,
            allRoles.user.create,
            allRoles.user.changePassword,
            allRoles.user.changeStatus,
            allRoles.user.delete,
            allRoles.user.resetPassword,
            allRoles.user.update,
          ],
          async: true,
        },
      },
    ],
  },

  // will match everything and put it under `$route.params.pathMatch`
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export const asyncRoutes = routes.filter((item) => {
  if (item.meta && item.meta.env) {
    return item.meta.env === constant.nodeEnv;
  } else return true;
});

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
