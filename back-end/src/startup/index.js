const logger = require('../config/logger');
const createRoot = require('./create-root');

async function startup() {
  try {
    const promises = [createRoot()];
    await Promise.all(promises);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = startup;
