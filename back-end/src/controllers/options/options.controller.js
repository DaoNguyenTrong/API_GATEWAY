const catchAsync = require('../../utils/catchAsync');
const { optionService } = require('../../services/index');
const { allRoles } = require('../../config/roles');

const getOptions = catchAsync(async (req, res) => {
  const options = await optionService.getOptions();
  res.send(options);
});

const getAllRoles = catchAsync(async (req, res) => {
  res.send(allRoles);
});

module.exports = { getOptions, getAllRoles };
