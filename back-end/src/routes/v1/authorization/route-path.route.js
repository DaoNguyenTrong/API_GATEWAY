const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { routePathValidation } = require('../../../validations/index');
const { routePathController } = require('../../../controllers/index');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(routePathValidation.createRoutePath), routePathController.createRoutePath)
  .get(auth(), validate(routePathValidation.paginateRoutePath), routePathController.paginateRoutePath);

router
  .route('/:routePathId')
  .get(auth(), validate(routePathValidation.getRoutePathById), routePathController.getRoutePathById)
  .patch(auth(), validate(routePathValidation.updateRoutePathById), routePathController.updateRoutePathById)
  .delete(auth(), validate(routePathValidation.deleteRoutePathById), routePathController.deleteRoutePathById);

router
  .route('/:routePathId/children')
  .get(auth(), validate(routePathValidation.getPathChildren), routePathController.getPathChildren);

module.exports = router;
