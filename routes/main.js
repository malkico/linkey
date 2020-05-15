var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController")
const signUpController = require("../controllers/signUpController")
const loginCtrl = require("../controllers/loginController")

/* GET home page. */
router.get('/', indexController.getController);
router.post('/', indexController.postController);
router.use("/",indexController.errorController)

/* SIGN UP page */
router.get('/sign-up', signUpController.getController) 
router.post("/sign-up", signUpController.postController)
router.use("/sign-up", signUpController.errorController)

router.get('/terms-of-use', function(req, res, next) {
  res.render('main/terms-of-use');
});

router.get('/privacy-policy', function(req, res, next) {
  res.render('main/privacy-policy');
});


router.get("/log-in", loginCtrl.getPage)
router.post("/log-in", loginCtrl.loginIn)
router.use("/log-in",loginCtrl.error)

router.get("/reset-password", function(req, res, next){
    res.render("account/reset-password")
})

module.exports = router;
