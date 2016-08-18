/*jslint node:true*/
'use strict';

var passport = require('koa-passport');
var crypto = require('crypto');
var User = require('./model/user').User;


User.prototype.generateHash = function(password, cb) {
    if (!password) {
        return cb('');
    }
    var encrypred,
        salt = Math.round((new Date().valueOf() * Math.random())) + '';
    this.salt = salt;
    try {
        encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex');
        return cb(null, encrypred);
    } catch (err) {
        return cb(err);
    }
};




var authenticator = function(user_pass, supplied_pass, salt, cb) {
    if (!supplied_pass) {
        return cb(new Error("No password was supplied"));
    } else {
        if (crypto.createHmac('sha1', salt).update(supplied_pass).digest('hex') == user_pass) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    }

};

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



var LocalStrategy = require('passport-local').Strategy;
passport.use('local-signin', new LocalStrategy({
        usernameField: 'email'
    },
    function using(email, password, done) {
        User.findOne({
            'email': email
        }, function findOne(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(err);
            }
            authenticator(user.hash, password, user.salt, function verifyPassword(err, valid) {
                if (err) {
                    return done(err);
                }
                if (!valid) {
                    return done(null, false);
                }
                done(null, user);
            });
        });
    }
));

passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function using(req, email, password, done) {
        if (!req.user) {
            User.findOne({
                'email': email
            }, function findOne(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false);
                }
                // account information is in req.body
                // you can do your data validation here.
                delete req.body.password;
                user = new User(req.body);
                user.generateHash(password, function generateHash(err, password) {
                    if (err) {
                        return done(err);
                    }
                    user.hash = password;
                    user.save(function save() {
                        if (err) {
                            return done(err);
                        }
                        return done(null, user);
                    });

                });
            });
        } else {
            var user = req.user;
            user.generateHash(password, function generateHash(err, password) {
                if (err) {
                    return done(err);
                }
                user.hash = password;
                user.save(function save() {
                    if (err) {
                        return done(err);
                    }
                    done(null, user);
                });
            });
        }
    }
));




var FacebookStrategy = require('passport-facebook').Strategy;
var authconfig = require('./config/oauth.js').facebookAuth;

passport.use(new FacebookStrategy({
        clientID: authconfig.clientID,
        clientSecret: authconfig.clientSecret,
        callbackURL: authconfig.callbackURL,
        profileFields: ['id', 'displayName', 'email']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    newUser.facebook = {}
                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id; // set the users facebook id	                
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user	                
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value;
                    newUser.markModified('facebook');
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));