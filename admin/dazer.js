/*jslint node:true*/
'use strict';


//load coviews module forloading templates
var views = require('./views/index');

//load route module for loading routes
var route = require('./route.js');

//load logger module for loading logger
var logger = require('koa-logger');

//mount different koa app
var mount = require('koa-mount'),
    jsonp = require("koa-jsonp");

//load koa
var koa = require('koa');
var app = module.exports = koa();



//load the views
app.use(mount(views));



app.use(mount(route));

// Initiate logger

app.use(logger());

app.use(jsonp());

if(config.policy.need){
    //activate the models
};

if (!module.parent) {
        app.listen(4000);
        console.log("dazer admin is up and running")
}