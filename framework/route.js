/*jslint node:true*/
'use strict';

/**
 * Module dependencies.
 */
//load koa
var koa = require('koa');
var router = require('koa-router');
var parse = require('co-body');
var public_dir = require('koa-static');
var app = module.exports = koa();

var views = require('co-views');
var config = require('./config/app');

var User = require('./model/user').User;

if (config.view.need) {
  //activate the views
    var render = views(__dirname + '/' + config.view.folder_name, { ext: config.view.engine
                                                                  });
    console.log(config.view.folder_name);
};


// authentication
require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

//use the router


app.use(public_dir(__dirname + "/public"));
var Router = require('koa-router');

var default_router = new Router();

default_router.get('/', function *() {
 // this.body = "here comes the login or home page"
    this.body = yield render('login.ejs');
    //  this.body =  "unauthenticated";
});

default_router.get('/login', function *() {
    this.body = yield render('login.ejs');
});

// POST /login
default_router.post('/login',
  formidable(),
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);


default_router.get('/signup', function *() {
    this.body = yield render('signup.ejs');
});

var formidable = require('koa-formidable');


default_router.post('/signup', function* (next) {
  var form = yield formidable.parse(this);
    var that = this;
  //form.fields && form.files
     User
    .findOne({ email : form.fields.email })
    .exec(function (err, user) {
    //  if (err) that.body = "some strange error"
      if (!user){
          var user = new User({email: form.fields.email, fname: form.fields.fname, lname: form.fields.lname, password: form.fields.password });
          user.save(function (err) {
            if(err){ 
                console.log("cannot save the user");
                //that.body = "cannot save the user";
            }
              else  { this.body = yield "Registration sucessful";
                     console.log("registration sucessful");
                    }
          });
                } else {
                     console.log("email already registered");
                   //that.body = "This email is already registered";
                }
})});



default_router.get('/logout', function*(next) {
  this.req.logout();
  this.redirect('/');
});

/**default_router.get('/auth/facebook', passport.authenticate('facebook'));

default_router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);**/

/**app.use(function*(next) {
  this.req.query = this.query;

  yield next
}); **/
app.use(default_router.middleware());

app.use(function* (next) {
  if (this.req.isAuthenticated()) {
    yield render('home');
  } else {
    this.redirect('/')
  }
});

var secured = new Router();

secured.get('/app', function* (){
    this.body = yield render('home');
})


app.use(secured.middleware())