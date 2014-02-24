/*jslint node:true*/
'use strict';

/**
 * Module dependencies.
 */
//load koa
var koa = require('koa');
var router = require('koa-router');
var parse = require('co-body');
var app = module.exports = koa();

// authentication
require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

//use the router
var Router = require('koa-router');

var default_router = new Router();

default_router.get('/', function *() {
 // this.body = "here comes the login or home page"
      this.body = yield "1hello";
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
  this.req.query = this.query;

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



app.use(router(app));

app.use(function *(){
    var body = yield "hello";
});