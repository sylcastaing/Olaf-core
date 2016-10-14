import passport from 'passport';
import {
  Strategy as LocalStrategy
}
from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.findOne({
    email: email.toLowerCase()
  }).exec()
  .then(user => {
    if (!user) {
      return done(null, false, {
        message: 'Les identifiants sont incorrects.'
      });
    }
    user.authenticate(password, function (authError, authenticated) {
      if (authError) {
        return done(authError);
      }
      if (!authenticated) {
        return done(null, false, {
          message: 'Le mot de passe est incorrect.'
        });
      } else {
        return done(null, user);
      }
    });
  })
  .catch(err => done(err));
}

export function setup(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function (email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}