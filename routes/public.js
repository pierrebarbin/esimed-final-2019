const router = require('express').Router();
const passport = require('passport');
const setting = require(`${appRoot}/setting`);
const UserClass = require(`${appRoot}/models/user.js`);

module.exports = (db) => {

    const userdao = require(`${appRoot}/models/dao/userDAO.js`);
    const user = new userdao(db);

    router.get('/login', function (req,res) {
        res.render('auth/login',{url: req.urlHelper});
    });

    router.post('/login',
        passport.authenticate('local', { successRedirect: setting.login.successRedirect,
                                    failureRedirect: setting.login.failureRedirect,
                                    failureFlash: true })
    );

    router.get('/register', function (req,res) {

        req.param.addParams({
            formError: req.flash('formError')[0],
            formFields: req.flash('formFields')[0]
        });

        res.render('auth/register',req.param.anonymous(req));
    });

    router.post('/register',function(req,res){

        let pseudo = req.body.pseudo;
        let email = req.body.email;
        let password = req.body.password;
        let password_confirm = req.body.password_confirm;

        let inputs = {
            pseudo: pseudo,
            email: email
        }
        //Required pseudo
        if(pseudo === ""){

            req.errorHelper.redirectWithInputs(req,res,'register',inputs,{pseudo: 'Le pseudo est requis.'});
        //Required email
        }else if(email === ""){

            req.errorHelper.redirectWithInputs(req,res,'register',inputs,{email: 'L\'e-mail est requis.'});
        //Valid email
        }else if(!req.regex.email(email)){

            req.errorHelper.redirectWithInputs(req,res,'register',inputs, {email: 'L\'e-mail est invalide.'});

        }else {
            //If the email is already taken
            user.findOne({email: email},(err,email_exist) => {

                if(err){
                    req.errorHelper.redirectWithInputs(req,res,'register',inputs, {email: 'Une erreur est survenue, veuillez réessayer plus tard.'});
                }

                if(email_exist){

                    req.errorHelper.redirectWithInputs(req,res,'register',inputs, {email: 'Cet e-mail est déjà utilisé.'});
                //Required password
                }else if(password === ""){

                    req.errorHelper.redirectWithInputs(req,res,'register',inputs, {password: 'Le mot de passe est requis.'});
                //password and its confirmation doesn't match
                }else if(password !== password_confirm){

                    req.errorHelper.redirectWithInputs(req,res,'register',inputs, {password_confirm: 'Les mots de passe ne correspondent pas.'});
                //Success !
                }else{

                    user.insert({pseudo: pseudo, email: email, password: UserClass.hashPassword(password)})
                    .then((userObj) => {
                        //Log the user directly after register
                        req.login(userObj, function(err) {
                            if (err) {
                                return res.redirect(req.setting.login.failureRedirect);
                            }
                            return res.redirect(req.setting.login.successRedirect);
                        });
                    });
                }
            });
        }
    });

    return router;
};