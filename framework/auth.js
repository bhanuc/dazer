/*jslint node:true*/
'use strict';

var passport = require('koa-passport');
var crypto = require('crypto');
var User = require('./model/user').User;

User.prototype.generateHash = function (password, cb) {
    console.log(cb);
    if (!password) return cb('');
    var encrypred
    var salt = Math.round((new Date().valueOf() * Math.random())) + '';
          this.salt = salt;
    try {
      encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex')
      return cb(null, encrypred);
    } catch (err) {
      return cb(err);
    }
  }



    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
    done(err, user);
  });
});



var LocalStrategy = require('passport-local').Strategy;
passport.use('local-signin', new LocalStrategy({
    usernameField : 'email'
},
    function using(email, password, done) {
            User.findOne({'email': email}, function findOne(err,user){
                if (err) return done(err);
                if (!user) return done(err);
                user.verifyPassword(user.local.hash, password, function verifyPassword(err, valid) {
                    if (err) return done(err);
                    if (!valid) return done(null, false);
                    done(null, user);
                });
            });
                         }
                        ));

passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passReqToCallback : true
    },
    function using(req, email, password, done) {
      if (!req.user) {
        User.findOne({ 'email': email }, function findOne(err, user) {
          if (err) return done(err);
          if (user) return done(null, false);
            
          // account information is in req.body
          // you can do your data validation here.
          delete req.body.password;
          user = new User(req.body);
          user.generateHash(password, function generateHash(err, password) {   
          if (err) return done(err);
          user.hash = password;
          user.save(function save() {
            if (err) return done(err);
                
           return done(null, user);
          });
                           
          }
                           );
        });
      } else {
       var user = req.user;
        user.generateHash(password, function generateHash(err, password) {            
          if (err) return done(err);
          user.hash = password;
          user.save(function save() {
            if (err) return done(err);
            done(null, user);
          });
        });
      }
    }
  ));

                    

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