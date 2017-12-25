

const session = require('koa-session');
const config = require('./config/app');
const CSRF = require('koa-csrf');

// load route module for loading routes
const route = require('./route.js');

// load logger module for loading logger
const logger = require('koa-logger');

// mount different koa app
let mount = require('koa-mount'),
  mongoose = require('mongoose');

// load koa
const koa = require('koa');

const app = module.exports = new koa();
const public_dir = require('koa-static');


const passport = require('koa-passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(public_dir(`${__dirname}/public`));

app.keys = ['session key', 'secret example'];
app.use(session(app));

app.use(new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    disableQuery: false
  }));
// set the session options

if (config.database.username) {
  mongoose.connect(`mongodb://${config.database.username}:${config.database.password}@${config.database.url}:${config.database.port}`);
  var db = mongoose.connection;
  db.once('open', () => {
    console.log('MongoDB Connection is opened');
  });
} else {
  mongoose.connect(`mongodb://${config.database.url}:${config.database.port}`);
  var db = mongoose.connection;
  db.once('open', () => {
    console.log('MongoDB Connection is opened');
  });
}
// MongoDB Error Handling
db.on('error', console.error.bind(console, 'connection error:'));


// app.use(mount(route));
app.use(route.baseRouter.routes());
app.use(route.secured.routes());

// Initiate logger

app.use(logger());


app.use(async (ctx, next) => {
  await next;

  if (this.status != 404) return;

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
        message: 'Page Not Found',
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
});

if (!module.parent) {
  app.listen(3000);
  console.log(`${config.appname} is up and running on `, 'http://localhost:3000');
}
