const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins/index');

const routePathSchema = mongoose.Schema(
  {
    method: { type: String, required: false, default: null },
    path: { type: String, required: true },
    name: { type: String, required: true },
    isProxy: { type: Boolean, default: false },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    host: { type: String, default: '' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoutePath', default: null },
    limit: { type: Number, default: null },
    windowMs: { type: Number, default: null },
  },
  { timestamps: true }
);

routePathSchema.index({ path: 1, method: 1 }, { unique: true });

routePathSchema.plugin(toJSON);
routePathSchema.plugin(paginate);

routePathSchema.statics.isPathTaken = async function (path, method, excludeRoleId) {
  const routePath = await this.findOne({ path, method, _id: { $ne: excludeRoleId } });
  return !!routePath;
};

module.exports = mongoose.model('RoutePath', routePathSchema);
