var path = require('path');
global.appRoot = path.resolve(__dirname);

const express = require('express');
const app = express();
const session = require("express-session");

const twig = require("twig")
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const setting = require('./setting');

/**
 * App middlewares
 */
app.use('/static', express.static(__dirname + '/public'));
app.use(session({
    secret: setting.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 *  twig template engine
 **/

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');

/**
 * Routes
 */
require('./routes/router.js')(app);

/**
 * App bootstrap
 */
app.listen(setting.port, function () {
    console.log(`App listening on port ${setting.port}!`)
})