const router = require('express').Router();
const UserClass = require(`${appRoot}/models/user.js`);

module.exports = (db) => {

    const userdao = require(`${appRoot}/models/dao/userDAO.js`);
    const challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
    const user = new userdao(db);
    const challenge = new challengedao(db);

    router.get('/', function (req,res) {

        challenge.findByUser(req.user[0].id)
        .then((challenges)=>{

            req.param.addParams({
                challenges: challenges
            });

            res.render('account/show',req.param.connected(req));

        },(err) => {console.log(err)});
    });

    router.get('/edit', function (req,res) {

        let formFields = req.flash('formFields')[0] || {pseudo: req.user[0].pseudo, email: req.user[0].email};

        req.param.addParams({
            formError: req.flash('formError')[0],
            formFields: formFields
        });

        res.render('account/edit',req.param.connected(req));
    });

    router.post('/edit', function (req,res) {

        let pseudo = req.body.pseudo;
        let email = req.body.email;

        let inputs = {
            pseudo: pseudo,
            email: email
        }

        let error_redirect_path = 'account/edit';

        //Required pseudo
        if(pseudo === "" || !pseudo){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{pseudo: 'Le pseudo est requis.'});
        //Required email
        }else if(email === "" || !email){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{email: 'L\'e-mail est requis.'});
        //Valid email
        }else if(!req.regex.email(email)){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs, {email: 'L\'e-mail est invalide.'});

        }else {
            //If the email is already taken
            user.findOne({email: email},(err,user_exist) => {

                if(err){
                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs, {email: 'Une erreur est survenue, veuillez réessayer plus tard.'});
                }

                if(user_exist && user_exist.email != req.user[0].email){

                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs, {email: 'Cet e-mail est déjà utilisé.'});
                //Success !
                }else{

                    user.updateData(req.user[0].id,{pseudo: pseudo, email: email})
                    .then(() => {
                        //Add toast
                        res.redirect(`${req.urlHelper}/account`);
                    },()=>{});
                }
            });
        }
    });

    router.get('/password/change', function (req,res) {

        req.param.addParams({
            formError: req.flash('formError')[0],
        });

        res.render('account/password_edit',req.param.connected(req));
    });

    router.post('/password/change', function (req,res) {

        let password = req.body.password;
        let password_new = req.body.password_new;
        let password_new_confirmation = req.body.password_new_confirmation;

        let error_redirect_path = 'account/password/change';

        if(password === "" || !password){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,{},{password: 'L\'ancien mot de passe est requis.'});

        }else if(!UserClass.instanciate(req.user[0]).validPassword(password)){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,{},{password: 'L\'ancien mot de passe est incorrect.'});

        }else if(password_new === "" || !password_new){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,{},{password_new: 'Le nouveau mot de passe est requis.'});

        }else if(password_new !== password_new_confirmation){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,{},{password_new_confirmation: 'La confirmation ne correspond pas au nouveau mot de passe.'});

         //Success !
        }else{

            user.updatePassword(req.user[0].id,{password: UserClass.hashPassword(password_new)})
            .then(() => {
                //Add toast
                res.redirect(`${req.urlHelper}/account`);
            },()=>{});
        }
    });

    return router;
}