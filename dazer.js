//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app'); 

//Start koa
var koa = require('koa');
var app = koa();

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
};

app.use(function *(){
  this.body = 'Hello World Form Dazer';
});

if (!module.parent) {
        app.listen(3000);
        console.log("dazer is up and running");
};