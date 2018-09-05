// Módulos
var express = require('express');
var mongo = require('mongodb');
var app = express();
var bodyParser = require('body-parser');

var apiKey = 2;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Limitless Translate api
// https://www.npmjs.com/package/limitless-google-translate

var gestorDB = require("./modules/gestorDB.js");
var googleTranslate = require('google-translate')(apiKey); //Conseguir la apiKey
var limitless = require('limitless-google-translate');
var gestorServer = require("./modules/gestorServer.js");
var isoCodes = require('iso-639-1');
app.set('port', (process.env.PORT || 8081));
app.set('db', 'mongodb://admin:tfgjavier123@ds125372.mlab.com:25372/tfgjavier');
app.set('appLang', 'es');
var traductor = require("./modules/traductor.js");
var limitlessTraductor = require("./modules/traductorLimitless.js");
var isoLangCodes = require("./modules/isoLangCodes.js");

gestorDB.init(app, mongo);
traductor.init(app, googleTranslate);
gestorServer.init(app, gestorDB, limitless);
limitlessTraductor.init(app, limitless);
isoLangCodes.init(app, isoCodes);

//Require
require("./routes/rtexts.js")(app, gestorDB); // app para que la utilice el route.
require("./routes/rtest.js")(app, gestorDB, traductor, gestorServer);
require("./routes/rusuarios.js")(app, gestorDB);
require("./routes/rapiservertraductions.js")(app, gestorDB, gestorServer, traductor, limitlessTraductor, isoLangCodes);
app.get("/", function (req, res) {
    res.send("Servidor en funcionamiento.");
});
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});












//---------------------------------------------------------------------------------------



/*var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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

*/
