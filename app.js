const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const exphbs = require('express-handlebars');
const registerHelper = require("./config/registerHelper")
const dotenv = require("dotenv");
var favicon = require('serve-favicon')

dotenv.config({
  path: true
});
require('custom-env').env(true)
const Handlebars = require('handlebars')
const changeLang = require("./middlwares/changeLang")
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')


const i18n = require("i18n");
i18n.configure({
  locales: ['en', 'es', 'fr', 'ar'],
  defaultLocale: 'en',
  queryParameter: 'switch_lang',
  // fallbacks : "en",
  cookie: process.env.prefix + 'i18n_lang',
  updateFiles: true, // default true :: if I use some word don't exist on my files local, it will create automatically
  syncFiles: true, // default false
  autoReload: true, // defeaul false
  directory: __dirname + '/locales',
  objectNotation: true,
  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  /* logDebugFn: function (msg) {
    console.log('debug', msg);
  }, */

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg);
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg);
  },
  api: {
    '__': 't', //now req.__ becomes req.t
    '__n': 'tn' //and req.__n can be called as req.tn
  },

});
app.use(i18n.init);

app.set('trust proxy', 1) // trust first proxy
app.use(cookieParser());
app.use(cookieSession({
  name: process.env.prefix + 'session',
  keys: ['key1', 'key2']
}))

/* 
app.use(require('express-session')({
  secret: 'keyboard_cat',
  resave: true,
  saveUninitialized: true, 
  cookie: { secure: false,        
  httpOnly: true,
  maxAge  : 60 * 60 * 1000 
 }
})) 
 */

const indexRouter = require('./routes/main');
const followerRouter = require('./routes/follower');
const influencerRouter = require("./routes/influencer")

/* ************************** create connection */
const mongoose = require("mongoose")
const mongoDB = process.env.mongoDB
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));

var io = require("socket.io")();
app.io = io
const socketCtrl = require("./sockets/get")
io.on("connection", function (socket) {
  console.log("un nouveau client est connecté");
  socketCtrl(socket)
})


app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/mdbootstrap', express.static(__dirname + '/node_modules/mdbootstrap'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/popper.js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: "hbs",
  defaultLayout: "",
  partialsDir: [path.join(__dirname, 'views')],
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    // Function to do basic mathematical operation in handlebar
    math: registerHelper.math,
    format_currency: registerHelper.format_currency,
    log: registerHelper.log,
    ifCond: registerHelper.ifCond,
    ternaryIf: registerHelper.ternaryIf,
    iff: registerHelper.iff,
    get: registerHelper.get,
    objIsEmpty: registerHelper.objIsEmpty,
    json: registerHelper.json,
    // t: registerHelper.t,
    translate: registerHelper.translate,
    dateFormat: require('handlebars-dateformat')
  }
}))
app.set('view engine', 'hbs');
app.use(function (request, response, next) {
  if (process.env.NODE_ENV == 'production' && !request.secure) {
    console.log("redirecting to https...")
    return response.redirect(301,"https://" + request.headers.host + request.url)
  }
  next()
})
app.use(changeLang)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images/favicon_io', 'favicon.ico')))
app.use('/', indexRouter);
app.use('/u', followerRouter);
app.get("/account/confirmation/:code", require("./controllers/confirmationEmailController").get)
app.use("/dashboard/", influencerRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/// mongoose.connection.close();

module.exports = app;

// i18n.setLocale("en") 
// console.log(registerHelper.translate("models.link.URL.minlength|@|2"))

console.log("Env : " + process.env.NODE_ENV)
console.log("host : " + process.env.domain)