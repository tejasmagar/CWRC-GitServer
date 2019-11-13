var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var github = require('./routes/github');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser({limit: '50mb'}))
app.use(cookieParser());

var config = require('./config.js');
app.use(`${config.gitserver_root_prefix}/github`, github);

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
    res.end(`<div>Error: ${err.message} and stack trace: ${err}</div>`);
  //  res.render('error', {
   //   message: err.message,
  //    error: err
   // });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end(`<div>Error: ${err.message} and stack trace: ${err}</div>`);
  //res.render('error', {
  //  message: err.message,
  //  error: {}
  //});
});



module.exports = app;
