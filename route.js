/*jslint node:true*/

/**
 * Module dependencies.
 */
//load koa
var koa = require('koa');
var parse = require('co-body');
var public_dir = require('koa-static');
var app = module.exports = koa();
var views = require('co-views');
var config = require('./config/app');
var User = require('./model/user').User;
var formidable = require('koa-formidable');

var parser = function *parser( next) {
  this.req.body = yield parse(this);
  yield next;
}

//if (config.view.need) {
  //activate the views
var render = views(__dirname + '/' + config.view.folder_name, { ext: config.view.engine });

//};


// authentication
require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

//use the router


app.use(public_dir(__dirname + "/public"));
var Router = require('koa-router');

var default_router = new Router();

//=======================================
//HOME PAGE (containing loging links)
//=======================================

default_router.get('/', function *() {
    this.body = yield render('home.ejs');
});

//=======================================
//Login PAGE 
//=======================================

default_router.get('/login', function *() {
    this.body = yield render('login.ejs');
});

//=======================================
//handle login request from the form
//=======================================

default_router.post('/login',
  parser,
  passport.authenticate('local-signin', {
    successRedirect: '/app',
    failureRedirect: '/login'
  })
);

//=============================================
// route for facebook authentication and login
//=============================================
	
default_router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

//=============================profile=================================
// handle the callback after facebook has authenticated the user
//==============================================================
http://api.shephertz.com/
    default_router.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
		    successRedirect : '/app',
			failureRedirect : '/'
		}));




//=======================================
//Render sign up page
//=======================================

default_router.get('/signup', function *() {
    this.body = yield render('signup');
});


//=======================================
//Handle sign-up post request from the form
//=======================================// POST /signup
default_router.post('/signup',
  parser,
  passport.authenticate('local-signup', {
    successRedirect: '/app',
    failureRedirect: '/signup'
  })
);



	// =====================================
	// LOGOUT ==============================
	// =====================================

default_router.get('/logout', function*(next) {
  this.req.logout();
  this.redirect('/');
});

/**app.use(function*(next) {
  this.req.query = this.query;

  yield next
}); **/
app.use(default_router.middleware());

	// =====================================
	// check the login ==============================
	// =====================================
app.use(function* (next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/login')
  }
});

var secured = new Router();

secured.get('/app', function* (){
    var userdetails = this.req.user;
    this.body = yield render('view.ejs',{ user : userdetails});
})


app.use(secured.middleware())