const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { Schema } = mongoose;

const mapScreenSchema = mongoose.Schema(
  {
    screen: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  },
  { timestamps: true }
);

mapScreenSchema.index({ screen: 1, role: 1 }, { unique: true });

mapScreenSchema.plugin(toJSON);
mapScreenSchema.plugin(paginate);

const mapScreen = mongoose.model('map-screen', mapScreenSchema);

module.exports = mapScreen;
