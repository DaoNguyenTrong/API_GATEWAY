const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { screenService } = require('../../services/index');
const { allRoles } = require('../../config/roles');

module.exports.createScreen = catchAsync(async (req, res) => {
  const user = req.user;
  const body = req.body;
  body.createdBy = user.id;
  const screen = await screenService.createScreen(body);
  res.status(httpStatus.CREATED).send(screen);
});

module.exports.getScreens = catchAsync(async (req, res) => {
  const user = req.user;
  const rights = user.roles;
  const whiteLists = [allRoles.admin, allRoles.role.create, allRoles.role.delete, allRoles.role.update, allRoles.role.view];
  const inWhiteList = whiteLists.some((item) => rights.includes(item));
  const filter = {};
  if (!inWhiteList && rights.length) {
    filter.$or = [];
    rights.forEach((right) => {
      filter.$or.push({ action: right });
    });
  }
  if (req.query.isTool) {
    filter.isTool = true;
  }
  const screens = await screenService.getScreens(filter);
  res.send(screens);
});

module.exports.getAccessedTools = catchAsync(async (req, res) => {
  const user = req.user;
  const rights = user.roles;
  const filter = {};
  const screens = await screenService.getScreens(filter);
  const rightScreens = screens.filter((item) => rights.includes(item.action));
  if (user.roles.includes(allRoles.admin)) {
    res.send(screens);
  } else {
    const results = filterAccessedTools(rightScreens, screens);
    res.send(results);
  }
});

function filterAccessedTools(rightScreens, screens) {
  let results = [];
  rightScreens.forEach((item) => {
    if (item.isTool) {
      results.push(item);
    } else {
      const right = screens.find((screen) => screen._id.equals(item.parent));
      if (right) {
        results = [...results, ...filterAccessedTools([right], screens)];
      }
    }
  });
  return Array.from(new Set(results));
}

module.exports.updateScreenById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const screen = await screenService.updateScreenById(id, body);
  res.send(screen);
});

module.exports.deleteScreenById = catchAsync(async (req, res) => {
  const id = req.params.id;
  await screenService.deleteScreenById(id);
  res.status(httpStatus.NO_CONTENT).send();
});
