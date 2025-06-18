const { roleService, accountService, mapScreenService } = require('../services/index');
const logger = require('../config/logger');
const config = require('../config/config');

const createRoot = async () => {
  try {
    const adminScreen = await createAdminScreen();
    const admin = await createAdminRole(adminScreen);
    await createRootUser(admin, adminScreen);

    logger.info('Root user is created');
  } catch (error) {
    logger.error('Create root user failed', error);
  }
};

const createAdminScreen = async () => {
  let adminScreen = await roleService.getScreenByAction('admin');
  if (!adminScreen) {
    adminScreen = await roleService.createScreen({
      name: 'Quản trị viên hệ thống',
      action: 'admin',
    });
    logger.info('Create admin screen');
  }
  return adminScreen;
};

const createAdminRole = async (adminScreen) => {
  let admin = await roleService.getRoleByRoleName('Admin');
  if (!admin) {
    admin = await roleService.createRole({
      roleName: 'Admin',
      description: 'Quản trị viên hệ thống',
      level: 1,
    });
    mapScreenService.createMapScreen(admin.id, adminScreen.id);
  }
  logger.info('Admin role is created');
  return admin;
};

const createRootUser = async (admin) => {
  const root = await accountService.getAccountByUsername(config.root.username);
  if (!root) {
    await accountService.createAccount({
      username: config.root.username,
      password: config.root.password,
      email: config.root.email,
      name: config.root.username,
      roleId: admin.id,
      type: config.userType.employee,
      createdBy: config.AUTO,
    });
    logger.info(`Created root user with username: ${config.root.username} and password: ${config.root.password}`);
  } else {
    if (root.roleId !== admin.id) {
      await accountService.updateAccountById(root.id, { roleId: admin.id });
      logger.info("Updated root role's id");
    }
  }
};

module.exports = createRoot;
