const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const apiKeySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    status: { type: Boolean, default: true },
    description: {
      type: String,
    },
    expiredDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  },
  {
    timestamps: true,
  }
);

apiKeySchema.plugin(toJSON);
apiKeySchema.plugin(paginate);

module.exports = mongoose.model('ApiKey', apiKeySchema);
