/*jslint node:true*/
'use strict';


var views = require('co-views');

var render = views(__dirname + '/' + 'views' , { ext: 'ejs' });



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




// Initiate logger

app.use(logger());

app.use(jsonp());

app.use(function *(next) {
  this.body = yield render('main.ejs');
});



if (!module.parent) {
        app.listen(4000);
        console.log("dazer admin is up and running")
}