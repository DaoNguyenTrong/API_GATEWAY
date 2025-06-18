const express = require('express');
const authRoute = require('./authentication/auth.route');
const accountRoute = require('./authentication/account.route');
const docsRoute = require('./docs.route');
const roleRoute = require('./authorization/role.route');
const optionsRoute = require('./options/options.route');
const notificationRoute = require('./notifications/index');
const fileRoute = require('./file.route');
const screenRoute = require('./authorization/screen.route');
const apiKeyRoute = require('./authorization/api-key.route');
const routePathRoute = require('./authorization/route-path.route');
const apiKeyScreenRoute = require('./authorization/api-key-screen.route');
const routePathScreenRoute = require('./authorization/route-path-screen.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/account', route: accountRoute },
  { path: '/role', route: roleRoute },
  { path: '/screen', route: screenRoute },
  { path: '/option', route: optionsRoute },
  { path: '/file', route: fileRoute },
  { path: '/notification', route: notificationRoute },
  { path: '/api-key', route: apiKeyRoute },
  { path: '/api-key-screen', route: apiKeyScreenRoute },
  { path: '/route-path', route: routePathRoute },
  { path: '/route-path-screen', route: routePathScreenRoute },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
