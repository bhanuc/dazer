/*jslint node:true*/
'use strict';


var views = require('co-views');

var render = views('./views', { ext: 'ejs' });

//mount different koa app
var mount = require('koa-mount');

//load koa
var koa = require('koa');
var app = module.exports = koa();

//router
var Router = require('koa-router');

//loads routes from route file

var routes = require('./route.js');

var myrouter = new Router();

//add the routes to the router

var items = Object.keys(routes);
items.forEach(function (item) {
    myrouter.get(item, routes[item]);
});
app.use(myrouter.middleware());
if (!module.parent) {
        app.listen(4000);
        console.log("dazer admin is up and running")
}