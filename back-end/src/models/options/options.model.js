const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const optionSchema = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: Array, required: true },
  type: { type: String, required: true },
});

optionSchema.plugin(toJSON);

const option = mongoose.model('option', optionSchema);

module.exports = option;
