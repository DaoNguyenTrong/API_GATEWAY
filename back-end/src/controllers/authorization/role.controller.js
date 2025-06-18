const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { roleService, mapScreenService } = require('../../services/index');
const { allRoles } = require('../../config/roles');
const mongoose = require('mongoose');

const createRole = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const role = await roleService.createRole(req.body.role);
    const screens = [];
    req.body.screens.forEach(async (screen) => {
      const map = await mapScreenService.createMapScreen(role.id, screen);
      screens.push(map);
    });
    await session.commitTransaction();
    session.endSession();
    res.status(httpStatus.CREATED).send({ role, screens });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getAllRoles = catchAsync(async (req, res) => {
  const result = await roleService.getAllRoles(req.user);
  res.send(result);
});

const getRoleById = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const screens = await mapScreenService.getMapScreenByRole(role.id);
  res.send({ role, screens });
});

const updateRole = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const role = await roleService.updateRole(req.params.roleId, req.body.role);
    const screens = [];
    // Delete all map screen by role id
    await mapScreenService.deleteMapScreenByRole(req.params.roleId);
    // Create new map screen with this role
    req.body.screens.forEach(async (screen) => {
      const map = await mapScreenService.createMapScreen(role.id, screen);
      screens.push(map);
    });
    await session.commitTransaction();
    session.endSession();
    res.send({ role, screens });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const deleteRoleById = catchAsync(async (req, res) => {
  await roleService.deleteRoleById(req.params.roleId);
  await mapScreenService.deleteMapScreenByRole(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getRoleOptions = catchAsync(async (req, res) => {
  const user = req.user;
  const role = await roleService.getRoleById(user.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const level = role.level;
  const filter = { level: { $gte: level } };
  const roles = await roleService.getRoleOptions(filter, 'roleName');
  res.send(roles);
});

const getRoleScreens = catchAsync(async (req, res) => {
  res.send(allRoles);
});

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  getRoleById,
  deleteRoleById,
  getRoleOptions,
  getRoleScreens,
};
