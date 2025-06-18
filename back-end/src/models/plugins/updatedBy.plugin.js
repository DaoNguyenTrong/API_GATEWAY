/* eslint-disable no-param-reassign */

/**
 * It adds a method to the schema
 * @param schema - The schema that the plugin is being applied to.
 * @returns The schema.statics.updatedBy method is being returned.
 */
const updatedBy = (schema) => {
  /* Adding a method to the schema. */
  schema.statics.updatedBy = async function (body, user) {
    this.updatedBy = user;
    return this.save();
  };
};

module.exports = updatedBy;
