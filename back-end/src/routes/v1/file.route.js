const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileValidation = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');
const { upload } = require('../../config/multer');

const router = express.Router();

router.route('/').get(auth(), validate(fileValidation.getFileByDestination), fileController.getFileByDestination);

router.route('/single').post(auth(), upload.single('file'), fileController.uploadSingle);

router.route('/any').post(auth(), upload.any(), fileController.uploadMulti);

router.route('/path').get(auth(), validate(fileValidation.getFileByPath), fileController.getFileByPath);

router.route('/directories').get(auth(), validate(fileValidation.getDirectories), fileController.getDirectories);

module.exports = router;
