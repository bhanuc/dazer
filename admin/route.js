
var views = require('co-views');

var render = views('./views', { ext: 'ejs' });


module.exports = { 
    '/': function *(next) {
  this.body = "this is home";
},
    '/app': function *(next) {
  this.body = "this is app";
}

};