var crypto = require('crypto');
var fetch = require('node-fetch');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



// .env variables
var result = require('dotenv').config()
if (result.error) {
  throw result.error
} else {
  const endpoint = "https://api.pro.coinbase.com"
  app.set('api_key', result.parsed.API_KEY)
  app.set('api_secret', result.parsed.API_SECRET)
  app.set('api_passphrase', result.parsed.PASSPHRASE)

  const API_KEY = result.parsed.API_KEY
  const API_SECRET = result.parsed.API_SECRET
  const PASSPHRASE = result.parsed.PASSPHRASE

  const TIMESTAMP = Date.now() / 1000;
  const requestPath = '/accounts'
  const method = 'GET'
  const body = ''

  const message = TIMESTAMP + method + requestPath + body
  console.log("message", message);

  // decode the base64 secret
  const KEY = Buffer(API_SECRET, 'base64')
  // create a sha256 hmac with the secret
  const HMAC = crypto.createHmac('sha256', KEY);
  // sign the require message with the HMAC
  // and finally base64 encode the result
  const SIGNATURE = HMAC.update(message).digest('base64');

  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'CB-ACCESS-KEY': API_KEY,
      'CB-ACCESS-SIGN': SIGNATURE,
      'CB-ACCESS-TIMESTAMP': TIMESTAMP,
      'CB-ACCESS-PASSPHRASE': PASSPHRASE,
    }
  }

  console.log('endpoint', endpoint+requestPath)
  console.log('config', config)

  fetch(endpoint+requestPath, config)
    .then(r => r.json())
    .then(resp => {
      console.log(resp)
    })

}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
