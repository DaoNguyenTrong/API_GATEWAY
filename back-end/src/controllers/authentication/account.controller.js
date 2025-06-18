const httpStatus = require('http-status');
const { pick, pickToSearch } = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { accountService, roleService, mapScreenService } = require('../../services/index');
const { Role } = require('../../models/index');
const { allRoles } = require('../../config/roles');

const createAccount = catchAsync(async (req, res) => {
  const body = req.body;
  body.createdBy = req.user.id;
  const user = await accountService.createAccount(body, req.file);
  res.status(httpStatus.CREATED).send(user);
});

const getAccounts = catchAsync(async (req, res) => {
  const user = req.user;
  const role = await roleService.getRoleById(user.roleId);
  const roleIds = await Role.find({ level: { $gte: role.level } }, ['_id']);
  const filter = pick(req.query, ['name', 'roleId', 'type']);
  if (!filter.roleId) {
    filter.roleId = { $in: roleIds.map((item) => item._id) };
  }
  if (!user.roles.includes(allRoles.admin) && !user.accessAllProject) {
    filter.PrjID = { $in: user.PrjID };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = pickToSearch(req.query.keyword, ['email', 'name', 'phone', 'address', 'position']);
  const result = await accountService.queryAccounts(filter, options, search);
  res.send(result);
});

const getAccount = catchAsync(async (req, res) => {
  const user = await accountService.getAccountById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getAccountV2 = catchAsync(async (req, res) => {
  const user = await accountService.getAccountByIdV2(req.params.userId)
  if (!user.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user[0]);
})

const updateAccount = catchAsync(async (req, res) => {
  const body = req.body;
  body.updatedBy = req.user.id;
  const user = await accountService.updateAccountById(req.params.userId, body);
  res.send(user);
});

const changeStatus = catchAsync(async (req, res) => {
  const body = req.body;
  body.updatedBy = req.user.id;
  const user = await accountService.changeStatusById(req.params.userId, body);
  res.send(user);
});

const changeAccountPasswordById = catchAsync(async (req, res) => {
  const user = req.user;
  await accountService.changeAccountPasswordById(req.params.userId, req.body.password, user);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteAccount = catchAsync(async (req, res) => {
  await accountService.deleteAccountById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getRoleByAccount = catchAsync(async (req, res) => {
  const role = await accountService.getRoleByAccount(req.params.userId);
  res.send(role);
});

const getRoleScreenById = catchAsync(async (req, res) => {
  const role = await accountService.getRoleByAccount(req.params.userId);
  if (!role) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
  }
  const screens = await mapScreenService.getMapScreenByRole(role.id);
  res.send(screens);
});

const getInfo = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your information not found');
  }
  res.send(user);
});

const updateInfo = catchAsync(async (req, res) => {
  const user = req.user;
  Object.assign(user, req.body);
  user.updatedBy = user.id;
  const updated = await accountService.updateAccountById(user.id, user);
  res.send(updated);
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user || !(await user.isPasswordMatch(req.body.oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
  }
  await accountService.changeAccountPassword(user.id, req.body.password, user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAccountsWithFilter = catchAsync(async (req, res) => {
  const filter = JSON.parse(req.query.filter);
  const users = await accountService.getAccounts(filter);
  res.send(users);
});

module.exports = {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  changeStatus,
  changeAccountPasswordById,
  getRoleByAccount,
  getInfo,
  updateInfo,
  changePassword,
  getAccountsWithFilter,
  getRoleScreenById,
  getAccountV2
};
