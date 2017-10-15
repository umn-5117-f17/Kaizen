//const debug = require('debug')('app:startup');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

//var app = express();

// const expressMongoDb = require('express-mongo-db');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//
// const auth = require('./auth');
//
// const index = require('./routes/index');
const db = require('./routes/db');
const upload = require('./routes/upload');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var exphbs  = require('express-handlebars');

app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs', helpers: { // This was missing
    json:function(context) {
      return JSON.stringify(context).replace(/"/g, '&quot;');
    },
    substring:function(context) {
      return context.substring(0,200)+"...";
    }
}}));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
// app.use(expressMongoDb(process.env.DB_URI));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     store: new MongoStore({ url: process.env.DB_URI }),
//     resave: true,
//     saveUninitialized: true
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.use(function(req, res, next) {
//   // always make req.user available to the template
//   res.locals.user = req.user;
//   next();
// });

//app.use('/', index);
//app.use('/', auth.router);
app.use('/db', db);
app.use('/upload', upload);
app.get('/protected', ensureLoggedIn('/login'), function(req, res, next) {
 res.render('protected');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  console.error(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//debug(`app.js loaded`);

module.exports = app;
