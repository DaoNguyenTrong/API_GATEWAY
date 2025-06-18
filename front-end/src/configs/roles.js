export const allRoles = {
  admin: "admin",
  reportProblem: "reportProblem",
  dashboard: "dashboard",
  department: "department",
  problem: "problem",
  problemGroup: "problemGroup",
  user: {
    view: "user.view",
    create: "user.create",
    update: "user.update",
    delete: "user.delete",
    changeStatus: "user.changeStatus",
    resetPassword: "user.resetPassword",
    changePassword: "user.changePassword",
  },
  role: {
    view: "role.view",
    create: "role.create",
    update: "role.update",
    delete: "role.delete",
  },
  apiKey: {
    view: "api-key.view",
    create: "api-key.create",
    update: "api-key.update",
    delete: "api-key.delete",
  },
  routePath: {
    view: "route-path.view",
    create: "route-path.create",
    update: "route-path.update",
    delete: "route-path.delete",
  },
};

export const rolesTree = Object.values(allRoles).map((item, index) => {
  if (typeof item === "string") {
    return { id: item, label: item };
  } else {
    const children = Object.values(item).map((child) => {
      return {
        id: child,
        label: child,
      };
    });
    return {
      id: Object.keys(allRoles)[index],
      label: Object.keys(allRoles)[index],
      children,
    };
  }
});
