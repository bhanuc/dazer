/*jslint node:true*/
'use strict';

var passport = require('koa-passport');

var User = require('./model/user').User;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function (username, password, done) {
  // retrieve user ...
    User
    .findOne({ username : username, password: password })
    .exec(function (err, user) {
      if (err) return done(err)
      if (!user){
          return done(null, false);
                } else {
                    done(null, user);
                }
})}));

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
},
    function (token, tokenSecret, profile, done) {
    // retrieve user ...
        done(null, user);
    }
    ));