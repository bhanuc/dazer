/*jslint node:true*/
'use strict';
var session = require('koa-session');

//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app');

//load coviews module forloading templates
//var views = require('./views/index');

//load route module for loading routes
var route = require('./route.js');

//load logger module for loading logger
var logger = require('koa-logger');

//mount different koa app
var mount = require('koa-mount'),
    mongoose = require('mongoose');

//load koa
var koa = require('koa');
var app = module.exports = koa();
var public_dir = require('koa-static');


var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(public_dir(__dirname + "/public"));

require('koa-csrf')(app)
//set the session options

app.keys = ['session key', 'secret example'];
app.use(session(app));

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


// app.use(mount(route));
app.use(route.default_router.routes());
app.use(route.secured.routes());

// Initiate logger

app.use(logger());


app.use(function *pageNotFound(next){
  yield next;

  if (404 != this.status) return;

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
})

if (!module.parent) {
    app.listen(3000);
    console.log(config.appname + " is up and running on ", 'http://localhost:3000');
}
