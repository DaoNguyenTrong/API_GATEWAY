const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy, jwtStrategyFromQuery } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1/index');
const routesV2 = require('./routes/v2/index');
const { errorConverter, errorHandler } = require('./middlewares/error');
const directionAuth = require('./middlewares/directionAuth');
const i18n = require('i18n');
const createProxies = require('./proxies/index');
const fs = require('node:fs');
const exec = require('node:child_process').exec;
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const ogr2ogr = require('ogr2ogr');

const app = express();

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['vi', 'en'],
  defaultLocale: 'vi',

  // sets a custom cookie name to parse locale settings from
  cookie: 'accept-language',
  header: 'accept-language',
  queryParameter: 'accept-language',

  // where to store json files - defaults to './locales'
  directory: __dirname + '/locales',
  updateFiles: false,
});

app.use(i18n.init);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// Static files
app.use(`/${config.staticFolder}`, [directionAuth(), express.static(__dirname.replace('src', '') + config.staticFolder)]);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
passport.use('jwt-query', jwtStrategyFromQuery);
createProxies.reloadProxyRoutes(app);
app.post('/reload-routes', async (req, res) => {
  try {
    await createProxies.reloadProxyRoutes(app);
    res.json({ message: 'Reload thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reload thất bại' });
  }
});
// parse json request body
app.use(express.json());
app.post('/convert-kmz', upload.single('file'), async (req, res) => {
  const file = req.file; // Assuming file data is sent in request body
  // Create temporary file names for KMZ and GeoJSON
  const kmzPath = `temp_kmz_${Math.random().toString(36).substring(2, 15)}.kmz`;

  // Save uploaded KMZ data to temporary file
  fs.writeFileSync(kmzPath, file.buffer);
  // Convert path to GeoJSON.
  let { data } = await ogr2ogr(kmzPath);
  fs.unlinkSync(kmzPath);
  console.log(data);
  res.send(data);
});

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// v2 api routes
app.use('/v2', routesV2);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
