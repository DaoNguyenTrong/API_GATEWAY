const mongoose = require('mongoose');
const { createdBy, updatedBy, toJSON, paginate } = require('../models/plugins/index');

mongoose.plugin(createdBy);
mongoose.plugin(updatedBy);
mongoose.plugin(toJSON);
mongoose.plugin(paginate);

module.exports = mongoose;
