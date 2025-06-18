/* eslint-disable no-param-reassign */

/**
 * It adds a method to the schema that creates a new document and sets the createdBy field to the user
 * @param schema - The schema that the plugin is being applied to.
 * @returns The schema.statics.createdBy method is being returned.
 */
const createdBy = (schema) => {
  /* Adding a method to the schema. */
  schema.statics.createdBy = async function (body, user) {
    if (user) {
      this.createdBy = user;
    }
    return this.create(body);
  };
};

module.exports = createdBy;
