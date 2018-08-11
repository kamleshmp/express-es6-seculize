import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
const jwt = require('jsonwebtoken');

import User from '../model';
import config from '../../../config/config';
const PassportLocalStrategy = require('passport-local').Strategy;
/**
 * JWT STRATEGY
 */

const jwtOpts = {
  // Tell passport to take the jwt token from the Authorization headers
  jwtFromRequest: ExtractJwt.fromAuthHeader('Authorization'),
  secretOrKey: config.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (e) {
    return done(e, false);
  }
});


/**
 * Return the Passport Local Strategy object.
 */
const loginStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, async (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };


  // find a user by email address
  const user = await User.findOne({ where: { email: userData.email } })

    // if (err) { return done(err); }
    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    const isMatch = await user.comparePassword(userData.password)
      // if (passwordErr) { return done(passwordErr); }
      // console.log('-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', isMatch)

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user.get('id')
      };

      // // create a token string
      const token = jwt.sign(payload, config.JWT_SECRET);
      const data = {
        name: user.get('id')
      };

      return done(null, token, data);
    });
 


/**
 * Return the Passport Local Strategy object.
 */
const signupStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, async (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // const newUser = new User(userData);
  // newUser.save((err) => {
  //   if (err) { return done(err); }

  //   return done(null);
  // });


  try { 
    const user = await User.create(userData)
    if (!user) { return done(user); }
    return done(null);
    // you can now access the newly created task via the variable task
   
  } catch (err) {
    return done(err); 
  }
});

passport.use(jwtStrategy);
passport.use('local-signup', signupStrategy);
passport.use('local-login', loginStrategy);
