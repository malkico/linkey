var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController")
const signUpController = require("../controllers/signUpController")
const loginCtrl = require("../controllers/loginController")
const getStartedCtrl = require("../controllers/getStartdedController")


/* GET home page. */
router.get('/', indexController.getController);
router.post("/", getStartedCtrl.postController)
router.use("/", getStartedCtrl.errorController)

/* SIGN UP page */
router.get('/sign-up', signUpController.getController)
router.post("/sign-up", signUpController.postController)
router.use("/sign-up", signUpController.errorController)

router.get('/terms-of-use', function (req, res, next) {
  res.render('main/terms-of-use');
});
router.post("/terms-of-use", (req, res, next) => {
  res.locals.pageErr = 'main/terms-of-use'
  next()
}, getStartedCtrl.postController)
router.use("/terms-of-use", getStartedCtrl.errorController)

router.get('/privacy-policy', function (req, res, next) {
  res.render('main/privacy-policy');
});
router.post("/privacy-policy", (req, res, next) => {
  res.locals.pageErr = 'main/privacy-policy'
  next()
}, getStartedCtrl.postController)
router.use("/privacy-policy", getStartedCtrl.errorController)


router.get("/contact", require("../controllers/contactUscontroller"))
router.post("/contact", (req, res, next) => {
  res.locals.pageErr = 'main/contact'
  next()
}, getStartedCtrl.postController)
router.use("/contact", getStartedCtrl.errorController)

router.get("/log-in", loginCtrl.getPage)
router.post("/log-in", loginCtrl.loginIn)
router.use("/log-in", loginCtrl.error)

const resetPassword = require("../controllers/resetPassword")
router.get("/reset-password/:pass/:influencer_id", resetPassword.changePassword)
router.get("/reset-password", resetPassword.get)
router.post("/reset-password", resetPassword.post)

module.exports = router;