/*jslint node:true*/
'use strict';
var session = require('koa-session');

//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app');

//load coviews module forloading templates
var views = require('./views/index');

//load route module for loading routes
var route = require('./route.js');

//load logger module for loading logger
var logger = require('koa-logger');

//mount different koa app
var mount = require('koa-mount'),
    jsonp = require("koa-jsonp"),
    mongoose = require('mongoose');

//load koa
var koa = require('koa');
var app = module.exports = koa();

//set the session options
app.keys = ['secret'];
app.use(session());

if (config.database.username) {
    mongoose.connect('mongodb://' + config.database.username + ':' + config.database.password + '@' + config.database.url + ':' + config.database.port);
    var db = mongoose.connection;
    db.once('open', function callback() {
        console.log("MongoDB Connection is opened");
    });
} else {
    mongoose.connect('mongodb://' + config.database.url + ':' + config.database.port);
    var db = mongoose.connection;
    db.once('open', function callback() {
        console.log("MongoDB Connection is opened");
    });
}
// MongoDB Error Handling
db.on('error', console.error.bind(console, 'connection error:'));


//use the passport

// authentication
require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());
//load the views
app.use(mount(views));

//use the router
var Router = require('koa-router');

var default_router = new Router();

default_router.get('/', function *() {
  this.body = "here comes the login or home page"
});

var formidable = require('koa-formidable');

// POST /login
default_router.post('/login',
  formidable(),
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

default_router.get('/logout', function*(next) {
  this.req.logout();
  this.redirect('/');
});

default_router.get('/auth/facebook', passport.authenticate('facebook'));

default_router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

app.use(function*(next) {
  this.req.query = this.query
  yield next
});

app.use(default_router.middleware());

// Require authentication for now
app.use(function*(next) {
  if (this.req.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
});

app.use(mount(route));

// Initiate logger

app.use(logger());

app.use(jsonp());

if(config.controller.need){
 //    activate the controllers
};

if(config.model.need){
};

if(config.policy.need){
    //activate the models
};

if (!module.parent) {
        app.listen(3000);
        console.log("dazer is up and running")
}