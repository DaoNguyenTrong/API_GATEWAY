const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    JWT_ISSUER: Joi.string().required().description('Json web token issuer'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    SUPER_ADMIN_USERNAME: Joi.string().required().description("The root's username"),
    SUPER_ADMIN_PASSWORD: Joi.string().required().description("The root's password"),
    SUPER_ADMIN_EMAIL: Joi.string().email().required().description("The root's email"),
    STATIC_FOLDER: Joi.string().description('The file upload folder'),
    PUBLIC_VAPID_KEY: Joi.string().description('The web-push public vapid key'),
    PRIVATE_VAPID_KEY: Joi.string().description('The web-push private vapid key'),
    ICT_HOST: Joi.string().required().description('ICT tool host'),
    PROXIES: Joi.string(),
    RMA_HOST: Joi.string(),
    CRAWL_HOST: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  PROXIES: envVars.PROXIES,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    issuer: envVars.JWT_ISSUER,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  root: {
    username: envVars.SUPER_ADMIN_USERNAME,
    email: envVars.SUPER_ADMIN_EMAIL,
    password: envVars.SUPER_ADMIN_PASSWORD,
  },
  staticFolder: envVars.STATIC_FOLDER,
  webPush: {
    public: envVars.PUBLIC_VAPID_KEY,
    private: envVars.PRIVATE_VAPID_KEY,
  },
  ictHost: envVars.ICT_HOST,
  rmaHost: envVars.RMA_HOST,
  fatHost: envVars.FAT_HOST,
  crawlHost: envVars.CRAWL_HOST,
  bigdataHost: envVars.BIGDATA_HOST,
  headers: {
    projectId: 'project-id',
  },
  documentStatus: {
    public: 'public',
    private: 'private',
    internal: 'internal',
  },
  position: { right: 'Bờ phải', left: 'Bờ trái', center: 'Giữa đập' },
  spillwayShape: {
    practicalSection: 'Mặt cắt thực dụng',
    trapezoidSection: 'Mặt cắt hình thang',
    pianoKeySection: 'Tràn piano',
  },
  projectTypes: { ADVANCE: 'ADVANCE', RENEW: 'RENEW', TOOL: 'TOOL' },
  userType: { employee: 'EMPLOYEE', customer: 'CUSTOMER' },
  questionType: { yesNo: 0, text: 1 },
  AUTO: 'AUTO',
};
