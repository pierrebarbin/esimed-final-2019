const db = require(`${appRoot}/database.js`).db(false);
const urlHelper = require(`${appRoot}/helpers/url`);
const setting = require(`${appRoot}/setting`);
const public = require('./public.js');

module.exports = (app) => {

    /**
     * Auth
     */
    require(`${appRoot}/passport`)(db);

    app.use('/', public);

    app.use(function(req,res,next){
        req.urlHelper = urlHelper.base(req);
        next();
    });

    app.use(function(req,res,next){

        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect(`${req.urlHelper}/login`)
        }
    });

    app.use(function(req,res,next){
        req.db = db;
        req.setting = setting;
        next();
    });

    app.get(`/logout`, (req, res) => {
        req.logout();
        res.redirect('/');
    })
}