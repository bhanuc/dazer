
/**
 * Module dependencies.
 */
//load koa
var koa = require('koa');
var router = require('koa-router');
var app = module.exports = koa();

app.use(router(app));

app.use(function *(){
    this.body = 'Hello World';
});