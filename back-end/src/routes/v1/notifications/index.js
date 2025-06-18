const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { notificationsController } = require('../../../controllers/index');
const { notificationsValidation } = require('../../../validations/index');
const { allRoles } = require('../../../config/roles');

const router = express.Router();

router
  .route('/')
  .post(
    auth(allRoles.notification),
    validate(notificationsValidation.sendNotificationToUsers),
    notificationsController.sendNotificationToUsers
  );

router
  .route('/subscription')
  .post(auth(), validate(notificationsValidation.subscription), notificationsController.subscription);

router
  .route('/subscription')
  .delete(auth(), validate(notificationsValidation.removeSubscription), notificationsController.removeSubscription);

router
  .route('/:userId')
  .post(auth(), validate(notificationsValidation.sendNotificationToUser), notificationsController.sendNotificationToUser);

module.exports = router;
