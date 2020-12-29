var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express App' });

  API_KEY = req.app.get('api_key')
  API_SECRET = req.app.get('api_secret')
  PASSPHRASE = req.app.get('passphrase')

});

module.exports = router;
