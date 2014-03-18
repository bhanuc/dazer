
var views = require('co-views');

var render = views('./views', { ext: 'ejs' });

var parser = function *parser( next) {
  this.req.body = yield parse(this);
  yield next;
}


module.exports = {
    'get': {
        '/': function *(next) {
  this.body = "this is home";
},
    '/createapp': function *(next) {
  this.body = yield render('c_app.ejs');;
}

    },
    'post': {
        '/createapp': function *(next) {
            this.body = "this is post home";
        }
    }
};