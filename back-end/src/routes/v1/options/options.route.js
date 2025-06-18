const express = require('express');
const auth = require('../../../middlewares/auth');
const { optionsController } = require('../../../controllers/index');

const router = express.Router();

router.route('/').get(auth(), optionsController.getOptions);

router.route('/roles-screen').get(optionsController.getAllRoles);

module.exports = router;
