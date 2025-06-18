/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};

/**
 * It takes a value and an array of keys, and returns an array of objects that can be used in a MongoDB
 * query
 * @param {string} value - The value to search for.
 * @param {array} keys - an array of keys to search
 * @returns {array<object>} An array of objects.
 */
const pickToSearch = (value, keys) => {
  return keys.reduce((obj, key) => {
    const regex = new RegExp(value, 'i');
    let tmp = {};
    tmp[key] = regex;
    obj.push(tmp);
    return obj;
  }, []);
};

module.exports = { pick, pickToSearch };
