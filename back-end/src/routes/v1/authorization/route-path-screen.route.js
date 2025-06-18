const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { routePathScreenValidation } = require('../../../validations/index');
const { routePathScreenController } = require('../../../controllers/index');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(routePathScreenValidation.createRoutePathScreen), routePathScreenController.createRoutePathScreen);

router
  .route('/multiple')
  .post(
    auth(),
    validate(routePathScreenValidation.createMultipleRoutePathScreen),
    routePathScreenController.createMultipleRoutePathScreen
  );

router
  .route('/screen/:screenId')
  .get(auth(), validate(routePathScreenValidation.getPathByScreenId), routePathScreenController.getPathByScreenId);

router
  .route('/route-path/:routePathId')
  .get(auth(), validate(routePathScreenValidation.getPathByRoutePathId), routePathScreenController.getPathByRoutePathId);

module.exports = router;
