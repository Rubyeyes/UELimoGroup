var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');

// import environment configuration
var config = require('./config/environment/development');

// import environment variable
require('./config/environment/envVariable');

// add models
require('./models/Comment');
require('./models/Post');
require('./models/Info');
require('./models/Fleet');
require('./models/Service');
require('./models/Order');
require('./models/Image');
require('./models/User');

// add passport configuration
require('./config/passport');

//add routes
var routes = require('./routes/index');
var routes_users = require('./routes/user');
var routes_info = require('./routes/info');
var routes_fleets = require('./routes/fleet');
var routes_services = require('./routes/service');
var routes_upload = require('./routes/upload');
var routes_orders = require('./routes/order');
var routes_email = require('./routes/email');

var app = express();

// connect mongolab
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
              }; 

var MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, function(err) {
  if (err) console.log(err);
});

// Populate databases with sample data
if (config.seedDB) { 
  require('./config/seed'); 
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set root path
app.set('appRoot', path.resolve(''));//set root path

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(app.get('appRoot') + '/client'));//serve the static index.html from the lib folder
app.use(favicon(path.resolve(app.get('appRoot') + '/favicon.png')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/api/users', routes_users);
app.use('/api/info', routes_info);
app.use('/api/fleets', routes_fleets);
app.use('/api/services', routes_services);
app.use('/api/upload', routes_upload);
app.use('/api/orders', routes_orders);
app.use('/api/email', routes_email);
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

//start server
/**
 * Module dependencies.
 */
var debug = require('debug')('server:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || 5000);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function() {
  console.log("Connected to port", app.get('port'))
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
