const allRoles = {
  admin: 'admin',
  dashboard: 'dashboard',
  accessAllProject: 'accessAllProject',
  user: {
    view: 'user.view',
    create: 'user.create',
    update: 'user.update',
    delete: 'user.delete',
    changeStatus: 'user.changeStatus',
    resetPassword: 'user.resetPassword',
    changePassword: 'user.changePassword',
  },
  role: {
    view: 'role.view',
    create: 'role.create',
    update: 'role.update',
    delete: 'role.delete',
  },
  project: {
    information: 'project.information',
  },
  notification: 'notification',
  rma: "rma",
  fat: "fat",
  crawl: "crawl"
};

const roles = [];

Object.keys(allRoles).forEach((role) => {
  if (typeof allRoles[role] === 'string') {
    roles.push(allRoles[role]);
  } else {
    Object.values(allRoles[role]).forEach((item) => {
      roles.push(item);
    });
  }
});

module.exports = {
  roles,
  allRoles,
};
