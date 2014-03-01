/*jslint node:true*/
'use strict';

var passport = require('koa-passport');

var User = require('./model/user').User;

passport.serializeUser(function (user, done) {
    console.log("serializer ran");
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log("deserializer ran");
    User.findById(id, function (err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function (email, password, done) {
  console.log(email+password);
    User
    .findOne({ email : email, password: password })
    .exec(function (err, user) {
      if (err)   console.log("error") ; return done(err)  ;
      if (!user){
           console.log("user not found");
          return done(null, false);
                } else {
                    done(null, user); 
                    console.log(user);
                }
})}));

/**var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
},
    function (token, tokenSecret, profile, done) {
    // retrieve user ...
        done(null, user);
    }
    ));**/