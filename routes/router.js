const db = require(`${appRoot}/database.js`).db(false);
const urlHelper = require(`${appRoot}/helpers/url`);
const setting = require(`${appRoot}/setting`);
const public = require('./public.js')(db);
const regex = require(`${appRoot}/helpers/regex`);
const errorHelper = require(`${appRoot}/helpers/error`);
const param = require(`${appRoot}/helpers/param`);
const moment = require('moment');

const challenge = require('./challenge.js')(db);
const account = require('./account.js')(db);

module.exports = (app) => {

    /**
     * Auth
     */
    require(`${appRoot}/passport`)(db);

    app.use(function(req,res,next){
        req.setting = setting;
        req.urlHelper = urlHelper.base(req);
        req.regex = regex;
        req.errorHelper = errorHelper;
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

    app.get(`/logout`, (req, res) => {
        req.logout();
        res.redirect('/');
    })
}