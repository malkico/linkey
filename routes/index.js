var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

router.get('/sign-in', function(req, res, next) {
  res.render('main/sign-in', { first_name: 'hicham', mail: 'hichamlmalki@gmail.com' });
});

router.get('/terms-of-use', function(req, res, next) {
  res.render('main/terms-of-use');
});

router.get('/privacy-polivcy', function(req, res, next) {
  res.render('main/privacy-polivcy');
});

module.exports = router;
