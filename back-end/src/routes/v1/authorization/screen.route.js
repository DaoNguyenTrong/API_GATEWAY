const express = require('express');
const validate = require('../../../middlewares/validate');
const { screenValidation } = require('../../../validations/index');
const { screenController } = require('../../../controllers/index');
const auth = require('../../../middlewares/auth');
const { allRoles } = require('../../../config/roles');

const router = express.Router();

router
  .route('/')
  .get(auth(), screenController.getScreens)
  .post(auth(allRoles.role.create), validate(screenValidation.createScreen), screenController.createScreen);

router.route('/tools').get(auth(), screenController.getAccessedTools);

router
  .route('/:id')
  .patch(auth(allRoles.role.update), validate(screenValidation.updateScreenById), screenController.updateScreenById)
  .delete(auth(allRoles.role.delete), validate(screenValidation.deleteScreenById), screenController.deleteScreenById);

module.exports = router;
