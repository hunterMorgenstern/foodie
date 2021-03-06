import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
require('dotenv').config();
import { loginQuery } from '../../components/auth/authQueries';
import { comparePasswords } from '../auth/bcrypt';
const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const localOptions = {
  usernameField: 'email',
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(
  new LocalStrategy(localOptions, async (email, password, done) => {
    try {
      const { rows } = await loginQuery({ email });
      if (!rows.length) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const passwordsMatch = await comparePasswords(password, rows[0].password);
      if (!passwordsMatch) {
        return done(null, false, { message: 'Incorrect password ' });
      }
      return done(null, rows);
    } catch (e) {
      return done(e);
    }
  })
);

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await loginQuery(jwt_payload.sub);
      if (user.length) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e);
    }
  })
);

export default passport;
