var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});


router.get('/terms-of-use', function(req, res, next) {
  res.render('main/terms-of-use');
});

router.get('/privacy-policy', function(req, res, next) {
  res.render('main/privacy-policy');
});

router.get('/sign-up', function(req, res, next) {
  res.render('account/sign-up', { first_name: 'hicham', mail: 'hichamlmalki@gmail.com' });
});

router.get("/log-in", function(req, res, next){
    res.render("account/log-in")
})

router.get("/reset-password", function(req, res, next){
    res.render("account/reset-password")
})

module.exports = router;
