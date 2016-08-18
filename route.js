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

var parser = function * parser(next) {
    this.req.body = yield parse(this);
    yield next;
}


var render = views(__dirname + '/' + config.view.folder_name, {
    ext: config.view.engine
});




// authentication and session
var auth = require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());


require('koa-csrf')(app)

//use the router


app.use(public_dir(__dirname + "/public"));


var Router = require('koa-router');
var default_router = new Router();

//=======================================
//HOME PAGE (containing loging links)
//=======================================

default_router.get('/', function * () {
    this.body = yield render('home.ejs', {
        appname: config.appname
    });
});

//=======================================
//Login PAGE 
//=======================================

default_router.get('/login', function * () {
    this.body = yield render('login.ejs', {
        appname: config.appname,
        csrf: this.csrf
    });
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

default_router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
}));

//=============================profile=================================
// handle the callback after facebook has authenticated the user
//==============================================================

default_router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/app',
        failureRedirect: '/'
    }));




//=======================================
//Render sign up page
//=======================================

default_router.get('/signup', function * () {
    this.body = yield render('signup', {
        appname: config.appname,
        csrf: this.csrf
    });
});

//=======================================
//Contact us Page
//=======================================

default_router.get('/contact', function * () {
    this.body = yield render('contact', {
        appname: config.appname,
        csrf: this.csrf
    });
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

default_router.get('/logout', function * (next) {
    this.req.logout();
    this.redirect('/');
});

//=======================================
//Render password reset page
//=======================================

default_router.get('/resetpassword', function * () {
    if (this.req.isAuthenticated()) {
        this.redirect(url + 'app');
    } else {
        this.body = yield render('reset.ejs', {
            appname: config.appname
        });
    }
});

//=======================================
//Handle Password Reset request
//=======================================

default_router.get('/reset-password', function * () {
    var token = this.request.query;
    if (token.token) {
        this.body = yield auth.check_token(token);
    } else {
        this.body = yield auth.create_token(token);
    }

});


app.use(default_router.middleware());



var secured = new Router();

secured.get('/app',auth.authenticated, function * () {
    var userdetails = this.req.user;
    this.body = yield render('view.ejs', {
        user: userdetails,
        appname: config.appname
    });
})


app.use(secured.middleware())

app.use(function *pageNotFound(next){
  yield next;

  if (404 != this.status) return;

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
})

