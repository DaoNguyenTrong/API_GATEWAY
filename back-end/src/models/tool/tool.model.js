const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { Schema } = mongoose;

const toolSchema = Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    screen: { type: Schema.Types.ObjectId, ref: 'Screen', default: null },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
toolSchema.plugin(toJSON);
toolSchema.plugin(paginate);

const Tool = mongoose.model('Tool', toolSchema);
module.exports = Tool;
