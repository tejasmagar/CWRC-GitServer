const express = require('express');
// const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./config.js');
const github = require('./routes/github');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser({limit: '50mb'}))
app.use(cookieParser());

app.use(`${config.gitserver_root_prefix}/github`, github);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
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
