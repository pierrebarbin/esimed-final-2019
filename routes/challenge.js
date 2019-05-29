const router = require('express').Router();


module.exports = (db) => {

    const challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
    const challenge = new challengedao(db);

    router.get('/', function (req,res) {

        let realized = req.query.realized === 'true' ? true : false;
        let popularity = req.query.popularity === 'true' ? true : false;

        challenge.findAll(realized,popularity)
        .then((challenges) => {

            req.param.addParams({
                challenges: req.momentHelper.transform(challenges,'created_at'),
            });

            res.render('challenge/list',req.param.connected(req));

        },(err) => {console.log(err);});
    });

    router.get('/create', function (req,res) {

        req.param.addParams({
            formError: req.flash('formError')[0],
            formFields: req.flash('formFields')[0],
        });

        res.render('challenge/create',req.param.connected(req));
    });

    router.post('/create', function (req,res) {

        let content = req.body.content;

        let error_redirect_path = 'challenge/create';

        let inputs = {content: content};

        if(content === ""){

            req.errorHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu est requis.'});

        }else if(content.length > 140){

            req.errorHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu doit faire 140 caractères maximum.'});

        }else{

            challenge.insert({
                content: content,
                is_realized: 0,
                amount_like: 0,
                user_id: req.user[0].id,
                created_at: req.moment().unix()
            })
            .then((challenge)=>{
                res.redirect(`${req.urlHelper}/challenge`);
            },()=>{})

        }
    });

    router.get('/edit/:id', function (req,res) {

        let id = req.params.id;

        challenge.findByUser(id,req.user[0].id)
        .then((challengeObj) => {

            if(challengeObj){

                let formFields = req.flash('formFields')[0] || challengeObj;

                req.param.addParams({
                    formError: req.flash('formError')[0],
                    formFields: formFields,
                    challenge: challengeObj
                });

                res.render('challenge/edit',req.param.connected(req));
            }else{

                res.render('error/404',req.param.connected(req));
            }

        },(err) => {console.log(err)});
    });

    router.post('/edit/:id', function (req,res) {

        let id = req.params.id;
        let content = req.body.content;

        let error_redirect_path = 'challenge/edit';

        let inputs = {content: content};

        challenge.findByUser(id,req.user[0].id)
        .then((challengeObj) => {

            if(challengeObj){

                if(content === ""){

                    req.errorHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu est requis.'});

                }else if(content.length > 140){

                    req.errorHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu doit faire 140 caractères maximum.'});

                }else{

                    challenge.update(id,content,'content')
                    .then(()=>{
                        res.redirect(`${req.urlHelper}/challenge`);
                    },()=>{})

                }
            }else{

                res.redirect(`${req.urlHelper}/challenge`);
            }

        },(err) => {console.log(err)});
    });

    return router;
}