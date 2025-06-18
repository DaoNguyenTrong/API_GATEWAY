const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { mapScreenService, accountService, apiKeyScreenService } = require('../services/index');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtOptionsFromQuery = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await accountService.getAccountById(payload.sid);

    if (!user) {
      return done(null, false);
    }
    const screens = await mapScreenService.getMapScreenByRole(user.roleId);
    const roles = screens.map((item) => item.screen.action);
    user.roles = [...roles];
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const jwtStrategyFromQuery = new JwtStrategy(jwtOptionsFromQuery, jwtVerify);

module.exports = {
  jwtStrategy,
  jwtStrategyFromQuery,
};
