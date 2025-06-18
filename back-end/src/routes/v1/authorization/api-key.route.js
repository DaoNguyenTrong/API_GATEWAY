const express = require('express');
const { apiKeyController } = require('../../../controllers/index');
const { apiKeyValidation } = require('../../../validations/index');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(apiKeyValidation.createApiKey), apiKeyController.createApiKey)
  .get(auth(), validate(apiKeyValidation.paginateApiKeys), apiKeyController.getApiKeys);

router
  .route('/:apiKeyId')
  .get(auth(), validate(apiKeyValidation.getApiKeyById), apiKeyController.getApiKeyById)
  .patch(auth(), validate(apiKeyValidation.updateApiKey), apiKeyController.updateApiKeyById)
  .delete(auth(), validate(apiKeyValidation.deleteApiKey), apiKeyController.deleteApiKeyById);

module.exports = router;
