const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const subscriptionSchema = mongoose.Schema(
  {
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    subscription: { type: Object, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

/* Creating a model called Subscription from the subscriptionSchema. */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
