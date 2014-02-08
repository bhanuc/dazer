//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app');

//load coviews module forloading templates
var views = require('./views/index');

//load route module for loading routes
var route = require('./route.js');

//load logger module for loading logger
var logger = require('koa-logger');
//mount different koa app
var mount = require('koa-mount');

//load koa
var koa = require('koa');
var app = module.exports = koa();

//load the views
app.use(mount(views));

//use the router
app.use(mount(route));

// Initiate logger

app.use(logger());

if(config.controller.need){
 //    activate the controllers
};
if(config.model.need){
    // activate the models
};
if(config.policy.need){
    //activate the models
};
if (!module.parent) {
        app.listen(3000);
        console.log("dazer is up and running");
};