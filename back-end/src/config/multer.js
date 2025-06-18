const multer = require('multer');
const { existsSync, mkdirSync } = require('fs');
const config = require('./config');
const listDestination = require('./fileType');
const { allRoles } = require('./roles');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('./logger');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const projectId = req.body.PrjID || req.params.PrjID || req.headers[config.headers.PrjID] || req.query.PrjID;
      const folder = req.query.directory || null;
      const user = req.user;
      if (!user.roles.includes(allRoles.admin) && !user.roles.includes(allRoles.accessAllProject) && !user.accessAllProject) {
        if (!user.PrjID.includes(projectId)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
        }
      }

      const mimetype = file.mimetype;
      // Create static folder if not exist
      const publicPath = config.staticFolder;
      const isPublicPathExist = existsSync(publicPath);
      if (!isPublicPathExist) mkdirSync(publicPath);
      let children = folder || listDestination[mimetype];
      if (!children) children = 'others';
      if (projectId) {
        // Upload file to project folder if has header's project id
        // Create project folder if not exist
        const prjPath = `${publicPath}/${projectId}`;
        const isPrjFolderExist = existsSync(prjPath);
        if (!isPrjFolderExist) mkdirSync(prjPath);

        // Create file'type folder if not exist
        let directory = `${prjPath}/${children}`;
        let directoryExits = existsSync(directory);
        if (!directoryExits) mkdirSync(`${directory}`);
        return cb(null, directory);
      } else {
        // Upload file to unknown folder
        let unknown = `${publicPath}/unknown`;
        const isUnknownExist = existsSync(unknown);
        if (!isUnknownExist) mkdirSync(unknown);
        let directory = `${unknown}/${children}`;
        let directoryExits = existsSync(directory);
        if (!directoryExits) mkdirSync(directory);
        return cb(null, directory);
      }
    } catch (error) {
      logger.error(error)
    }

  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  dest: config.staticFolder
});

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create static folder if not exist
    const publicPath = config.staticFolder;
    const isPublicPathExist = existsSync(publicPath);
    if (!isPublicPathExist) mkdirSync(publicPath);

    // Upload file to avatar folder
    let avatar = `${publicPath}/avatar`;
    const isAvatarExist = existsSync(avatar);
    if (!isAvatarExist) mkdirSync(avatar);
    let directory = `${avatar}`;
    let directoryExits = existsSync(directory);
    if (!directoryExits) mkdirSync(directory);
    return cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
});

module.exports = { upload, uploadAvatar };
