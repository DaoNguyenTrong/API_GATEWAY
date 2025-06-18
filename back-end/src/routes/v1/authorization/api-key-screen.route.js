const express = require('express');
const { apiKeyScreenController } = require('../../../controllers/index');
const { apiKeyScreenValidation } = require('../../../validations/index');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');

const router = express.Router();
router
  .route('/')
  .post(auth(), validate(apiKeyScreenValidation.createApiKeyScreen), apiKeyScreenController.createAsync)
  .get(auth(), validate(apiKeyScreenValidation.getApiKeyScreens), apiKeyScreenController.getApiKeyScreensAsync);

router
  .route('/multiple/:apiKeyId')
  .post(auth(), validate(apiKeyScreenValidation.createMultipleApiKeyScreen), apiKeyScreenController.createMultipleAsync);

router
  .route('/:apiKeyScreenId')
  .patch(auth(), validate(apiKeyScreenValidation.updateApiKeyScreen), apiKeyScreenController.updateAsync);

router
  .route('/:apiKeyId')
  .get(
    auth(),
    validate(apiKeyScreenValidation.getApiKeyScreenByApiKeyId),
    apiKeyScreenController.getApiKeyScreenByApiKeyIdAsync
  );

module.exports = router;
