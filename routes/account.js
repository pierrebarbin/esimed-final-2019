const router = require('express').Router();


module.exports = (db) => {

    router.get('/', function (req,res) {

        res.render('account/show',req.param.connected(req));
    });

    router.get('/edit', function (req,res) {

        res.render('account/edit',req.param.connected(req));
    });

    router.post('/edit', function (req,res) {

        let pseudo = req.body.pseudo;
        let email = req.body.email;

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
                //Success !
                }else{

                    user.updateData({pseudo: pseudo, email: email})
                    .then((userObj) => {
                        //Add toast
                        res.redirect(`${req.urlHelper}/account`);
                    });
                }
            });
        }
    });

    return router;
}