
const parse = require('co-body');
const views = require('co-views');
const config = require('./config/app');


const parser = async (ctx, next) => {
  ctx.req.body = await parse(this);
  await next;
};


const render = views(`${__dirname}/${config.view.folder_name}`, {
  ext: config.view.engine,
});


// authentication and session
const auth = require('./auth');
const passport = require('koa-passport');

// use the router


const Router = require('koa-router');

const baseRouter = new Router();

//= ======================================
// HOME PAGE (containing loging links)
//= ======================================

baseRouter.get('/', async (ctx) => {
  ctx.body = await render('home.ejs', {
    appname: config.appname,
  });
});

//= ======================================
// Login PAGE
//= ======================================

baseRouter.get('/login', async (ctx) => {
  ctx.body = await render('login.ejs', {
    appname: config.appname,
    csrf: ctx.csrf,
  });
});

//= ======================================
// handle login request from the form
//= ======================================

baseRouter.post(
  '/login',
  parser,
  passport.authenticate('local-signin', {
    successRedirect: '/app',
    failureRedirect: '/login',
  }),
);


//= ============================================
// route for facebook authentication and login
//= ============================================

baseRouter.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email',
}));

//= ============================profile=================================
// handle the callback after facebook has authenticated the user
//= =============================================================

baseRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/',
  }),
);


//= ======================================
// Render sign up page
//= ======================================

baseRouter.get('/signup', async (ctx) => {
  ctx.body = await render('signup', {
    appname: config.appname,
    csrf: ctx.csrf,
  });
});

//= ======================================
// Contact us Page
//= ======================================

baseRouter.get('/contact', async (ctx) => {
  ctx.body = await render('contact', {
    appname: config.appname,
    csrf: ctx.csrf,
  });
});


//= ======================================
// Handle sign-up post request from the form
//= ======================================// POST /signup
baseRouter.post(
  '/signup',
  parser,
  passport.authenticate('local-signup', {
    successRedirect: '/app',
    failureRedirect: '/signup',
  }),
);


// =====================================
// LOGOUT ==============================
// =====================================

baseRouter.get('/logout', async (ctx) => {
  ctx.req.logout();
  ctx.redirect('/');
});

//= ======================================
// Render password reset page
//= ======================================

baseRouter.get('/resetpassword', async (ctx) => {
  if (ctx.req.isAuthenticated()) {
    ctx.redirect(`${config.domainName}/app`);
  } else {
    ctx.body = await render('reset.ejs', {
      appname: config.appname,
    });
  }
});

//= ======================================
// Handle Password Reset request
//= ======================================

baseRouter.get('/reset-password', async (ctx) => {
  const token = ctx.request.query;
  if (token.token) {
    ctx.body = await auth.check_token(token);
  } else {
    ctx.body = await auth.create_token(token);
  }
});


const secured = new Router();

secured.get('/app', auth.authenticated, async (ctx) => {
  const userdetails = this.req.user;
  ctx.body = await render('view.ejs', {
    user: userdetails,
    appname: config.appname,
  });
});


module.exports = {
  secured,
  baseRouter,
};
