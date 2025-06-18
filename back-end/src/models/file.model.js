const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins/index');

const fileSchema = mongoose.Schema(
  {
    fieldname: { type: String, required: true, default: 'noname' },
    originalname: { type: String, required: true, default: 'noname' },
    encoding: { type: String, required: true },
    mimetype: { type: String },
    destination: { type: String },
    filename: { type: String },
    path: { type: String },
    size: { type: Number },
    createBy: { type: mongoose.ObjectId },
    projectId: { type: String, required: true, immutable: true },
  },
  {
    timestamps: true,
  }
);

fileSchema.plugin(toJSON);
fileSchema.plugin(paginate);

/**
 * @typedef File
 */
const File = mongoose.model('File', fileSchema);

module.exports = File;
