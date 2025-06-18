const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const roleSchema = mongoose.Schema(
  {
    roleName: { type: String, required: true, trim: true, unique: true },
    description: { type: String },
    level: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
roleSchema.plugin(toJSON);

/**
 * Check if roleName is taken
 * @param {string} roleName - The role's roleName
 * @param {ObjectId} [excludeRoleId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
roleSchema.statics.isRoleTaken = async function (roleName, excludeRoleId) {
  const role = await this.findOne({ roleName, _id: { $ne: excludeRoleId } });
  return !!role;
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
