//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app');

//load coviews module forloading templates
var views = require('co-views');

//load koa
var koa = require('koa');
var app = module.exports = koa();

if(config.controller.need){
 //    activate the controllers
};
if(config.model.need){
    // activate the models
};
if(config.policy.need){
    //activate the models
};
if(config.view.need){
  //activate the views
    var render = views(__dirname + '/'+config.view.folder_name, { ext: config.view.engine });
};
//some random data. only for prealpha phase
var data = {
    first : "Dazer"
};

app.use(function *(){
  this.body = yield render('view', { data: data });
});

if (!module.parent) {
        app.listen(3000);
        console.log("dazer is up and running");
};