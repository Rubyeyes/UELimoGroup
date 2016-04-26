var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

// add models
require('./models/Posts');
require('./models/Comments');
require('./models/User');

// add passport configuration
require('./config/passport');

//add routes
var routes = require('./routes/index');

var app = express();

// connect mongodb
mongoose.connect('mongodb://localhost/news')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set root path
app.set('appRoot', path.resolve('..'));//set root path

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(app.get('appRoot') + '/client'));//serve the static index.html from the lib folder
// app.use(favicon(path.resolve(app.get('appRoot') + '/favicon.ico')));
app.use(passport.initialize());

app.use('/', routes);
//redirect other url to angularjs
app.use(function(req, res) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendFile(path.resolve(app.get('appRoot') + '/client/index.html' ));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
