
//This file has all the configurations of the app such as each and every aspect of the framework

var config = require('./config/app');

if(config.model.need){
require("fs").readdirSync("./model").forEach(function(file) {
  require("./model/" + file);
    console.log(file);
});
};

