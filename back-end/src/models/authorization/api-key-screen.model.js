const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const apiKeyScreenSchema = mongoose.Schema(
  {
    apiKey: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
    screen: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
  },
  {
    timestamps: true,
  }
);

apiKeyScreenSchema.index({ apiKey: 1, screen: 1 }, { unique: true });

apiKeyScreenSchema.plugin(toJSON);
apiKeyScreenSchema.plugin(paginate);

module.exports = mongoose.model('ApiKeyScreen', apiKeyScreenSchema);
