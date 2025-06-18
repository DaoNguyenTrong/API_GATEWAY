const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roleValidation } = require('../../../validations/index');
const { roleController } = require('../../../controllers/index');
const { allRoles } = require('../../../config/roles');

const router = express.Router();

router
  .route('/')
  .get(auth(allRoles.role.view), roleController.getAllRoles)
  .post(auth(allRoles.role.create), validate(roleValidation.createRole), roleController.createRole);

router.route('/options').get(auth(), roleController.getRoleOptions);

router.route('/role-screens').get(auth(), roleController.getRoleScreens);

router
  .route('/:roleId')
  .get(auth(allRoles.role.view), validate(roleValidation.getRoleById), roleController.getRoleById)
  .patch(auth(allRoles.role.update), validate(roleValidation.updateRole), roleController.updateRole)
  .delete(auth(allRoles.role.delete), validate(roleValidation.deleteRole), roleController.deleteRoleById);

module.exports = router;
