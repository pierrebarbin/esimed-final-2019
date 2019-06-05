const db = require(`${appRoot}/database.js`).db(false);
const urlHelper = require(`${appRoot}/helpers/url`);
const setting = require(`${appRoot}/setting`);
const public = require('./public.js')(db);
const regex = require(`${appRoot}/helpers/regex`);
const redirectHelper = require(`${appRoot}/helpers/redirect`);
const param = require(`${appRoot}/helpers/param`);
const momentHelper = require(`${appRoot}/helpers/moment`);
const validation = require(`${appRoot}/helpers/validation`);
const moment = require('moment');

const challenge = require('./challenge.js')(db);
const account = require('./account.js')(db);
const like = require('./like.js')(db);
const fav = require('./favorite.js')(db);
const profile = require('./profile.js')(db);
const config = require('./config.js')(db);


module.exports = (app) => {

    /**
     * Auth
     */
    require(`${appRoot}/passport`)(db);

    app.use(function(req,res,next){

        moment.locale('fr');

        req.setting = setting;
        req.urlHelper = urlHelper.base(req);
        req.regex = regex;
        req.redirectHelper = redirectHelper;
        req.momentHelper = momentHelper;
        req.validation = validation;
        req.param = param;
        next();
    });

    app.use('/', public);

    app.use(function(req,res,next){

        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect(`${req.urlHelper}/login`)
        }
    });

    app.use(function(req,res,next){
        req.db = db;
        req.moment = moment;
        next();
    });

    app.use('/account', account);
    app.use('/challenge', challenge);
    app.use('/like', like);
    app.use('/favorite', fav);
    app.use('/profile', profile);
    app.use('/config', config);

    app.get(`/logout`, (req, res) => {
        req.logout();
        res.redirect('/');
    })
}