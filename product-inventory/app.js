var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const { JWT_SIGNING_KEY, LOGIN_REDIRECT_URL } = process.env;
var authorizationMiddleware = require('authorization-middleware');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({name: 'fa.pi.sid', resave: false, saveUninitialized: false, secret: 'fusionauth-node-example'}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authorizationMiddleware({ jwtSigningKey: JWT_SIGNING_KEY, loginRedirectUrl: LOGIN_REDIRECT_URL }));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
