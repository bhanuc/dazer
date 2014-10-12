
/**
 * Module dependencies.
 */
var views = require('co-views');
var config = require('../config/app');

//load koa
var koa = require('koa');
var app = module.exports = koa();

if(config.view.need){
  //activate the views
    var render = module.exports.render = views(__dirname + '/'+config.view.folder_name, { default: config.view.engine });
};