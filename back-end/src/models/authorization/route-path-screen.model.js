const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const routePathScreenSchema = mongoose.Schema(
  {
    routePath: { type: Schema.Types.ObjectId, ref: 'RoutePath', required: true },
    screen: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
  },
  { timestamps: true }
);

routePathScreenSchema.index({ routePath: 1, screen: 1 }, { unique: true });

routePathScreenSchema.plugin(toJSON);
routePathScreenSchema.plugin(paginate);

const routePathScreen = mongoose.model('RoutePathScreen', routePathScreenSchema);

module.exports = routePathScreen;
