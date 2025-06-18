const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { Schema } = mongoose;

const screenSchema = mongoose.Schema(
  {
    action: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, unique: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Screen' },
    locked: { type: Boolean, default: false },
    isTool: { type: Boolean, default: false },
    url: { type: String },
    icon: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

screenSchema.plugin(toJSON);
screenSchema.plugin(paginate);

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
