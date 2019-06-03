const router = require('express').Router();

const isOwnerChallenge = require(`${appRoot}/middlewares/IsOwnerChallenge`);
const isOwnerComment = require(`${appRoot}/middlewares/IsOwnerComment`);
const challengeExist = require(`${appRoot}/middlewares/ChallengeExist`);

module.exports = (db) => {

    const challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
    const commentdao = require(`${appRoot}/models/dao/commentDAO.js`);
    const challenge = new challengedao(db);
    const comment = new commentdao(db);

    router.get('/', function (req,res) {

        let realized = req.query.realized === 'true' ? true : false;
        let popularity = req.query.popularity === 'true' ? true : false;

        challenge.findAll(req.user[0],realized,popularity)
        .then((challenges) => {

            req.param.addParams({
                challenges: req.momentHelper.transform(challenges,'created_at'),
            });

            res.render('challenge/list',req.param.connected(req));

        },(err) => {console.log(err);});
    });

    router.get('/show/:id',challengeExist, function (req,res) {

        let challengeObj = req.challengeObj;

        comment.findByChallenge(challengeObj.id)
        .then((comments) => {

            req.param.addParams({
                formError: req.flash('formError')[0],
                formFields: req.flash('formFields')[0],
                formType: req.flash('formType')[0],
                comments: req.momentHelper.transform(comments,'created_at'),
                challenge: req.momentHelper.transform([challengeObj],'created_at')[0],
            });

            res.render('challenge/show',req.param.connected(req));

        },(err)=>{console.log(err);});
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

        if(content === "" || !content){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu est requis.'});

        }else if(content.length > 140){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu doit faire 140 caractères maximum.'});

        }else{

            challenge.insert({
                content: content,
                is_realized: 0,
                amount_like: 0,
                user_id: req.user[0].id,
                created_at: req.moment().unix()
            })
            .then((challenge)=>{
                req.redirectHelper.redirectWithToast(req,res,'challenge','Défi ajouté avec succès');
            },()=>{})

        }
    });

    /*router.get('/edit/:id',isOwnerChallenge, function (req,res) {

        let id = req.params.id;

        let challengeObj = req.challengeObj;

        let formFields = req.flash('formFields')[0] || challengeObj;

        req.param.addParams({
            formError: req.flash('formError')[0],
            formFields: formFields,
            challenge: challengeObj
        });

        res.render('challenge/edit',req.param.connected(req));
    });

    router.post('/edit/:id',isOwnerChallenge, function (req,res) {

        let id = req.params.id;
        let challengeObj = req.challengeObj;

        let content = req.body.content;

        let error_redirect_path = 'challenge/edit';

        let inputs = {content: content};

        if(content === "" || !content){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu est requis.'});

        }else if(content.length > 140){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu doit faire 140 caractères maximum.'});

        }else{

            challenge.update(id,content,'content')
            .then(()=>{

                req.redirectHelper.redirectWithToast(req,res,'account','Défi modifié avec succès');
            },()=>{})

        }
    });*/

    router.post('/delete/:id',isOwnerChallenge, function (req,res) {

        let id = req.params.id;
        let challengeObj = req.challengeObj;

        let content = req.body.content;

        let error_redirect_path = 'account';

        if(challengeObj.is_liked > 0 || challengeObj.is_commented > 0){

            req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Vous ne pouvez pas supprimer ce défi');

        }else{

            challenge.delete(id)
            .then(()=>{

                req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Défi supprimé avec succès');
            },()=>{})

        }
    });

    router.post('/visibility/hide/:id',isOwnerChallenge, function (req,res) {

        let challengeObj = req.challengeObj;

        let error_redirect_path = 'account';

        if(challengeObj.is_commented > 0 || challengeObj.is_visible === 0 ){

            req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Vous ne pouvez pas masquer ce défi');

        }else{

            challenge.visibility(challengeObj.id,0)
            .then(()=>{

                req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Défi masqué avec succès');
            },()=>{})

        }
    });

    router.post('/visibility/show/:id',isOwnerChallenge, function (req,res) {

        let challengeObj = req.challengeObj;

        let error_redirect_path = 'account';

        if(challengeObj.is_commented > 0 || challengeObj.is_visible === 1 ){

            req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Vous ne pouvez pas rendre visible ce défi');

        }else{

            challenge.visibility(challengeObj.id,1)
            .then(()=>{

                req.redirectHelper.redirectWithToast(req,res,error_redirect_path,'Défi rendu visible avec succès');
            },()=>{})

        }
    });

    router.post('/:id/comment/create',challengeExist, function (req,res) {

        let challengeObj = req.challengeObj;

        let content = req.body.content;
        let is_proof = req.body.is_proof;
        let files = req.files;

        let error_redirect_path = `challenge/show/${challengeObj.id}#create`;

        let inputs = {create: {
            content: content,
            is_proof: is_proof,
        }};

        if(content === "" || !content){

            req.flash('formType','create');
            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {content: 'Le contenu est requis.'}});

        }else if(content.length > 140){
            req.flash('formType','create');
            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {content: 'Le contenu doit faire 140 caractères maximum.'}});

        }else{

            if(is_proof){

                if(is_proof != 1){
                    req.flash('formType','create');
                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {is_proof: 'Une erreur est survenue, veuillez réessayer.'}});

                }else if (!files || !files.media) {

                    req.flash('formType','create');
                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {media: 'Une image ou vidéo est requise.'}});

                }else{

                    let media = files.media;

                    if(!req.validation.image(media.mimetype) && !req.validation.video(media.mimetype)){

                        req.flash('formType','create');
                        req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {media: 'L\'image ou la vidéo n\'est pas sous un format accepté.'}});

                    }else{

                        let path = `${appRoot}/public/medias/${media.md5}.${ req.validation.getMimeFile(media.mimetype) }`;

                        media.mv(path, function(err) {
                            if (err){
                                console.log(err);
                                req.flash('formType','create');
                                req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{create: {media: 'Une erreur est survenue lors du tranfert du média, veuillez réessayer.'}});
                            }else{
                                comment.insert({
                                    content: content,
                                    is_proof: 1,
                                    media: `/static/medias/${media.md5}.${ req.validation.getMimeFile(media.mimetype)}`,
                                    type_media: req.validation.getTypeFile(media.mimetype),
                                    is_accepted: 0,
                                    user_id: req.user[0].id,
                                    challenge_id: challengeObj.id,
                                    created_at: req.moment().unix(),
                                })
                                .then(() => {

                                    req.redirectHelper.redirectWithToast(req,res,`challenge/show/${challengeObj.id}`,'Commentaire ajouté avec succès');

                                },(err)=>{console.log(err)});
                            }
                          });
                    }
                }
            }else{
                comment.insert({
                    content: content,
                    is_proof: 0,
                    media: null,
                    type_media: null,
                    is_accepted: 0,
                    user_id: req.user[0].id,
                    challenge_id: challengeObj.id,
                    created_at: req.moment().unix(),
                })
                .then(() => {

                    req.redirectHelper.redirectWithToast(req,res,`challenge/show/${challengeObj.id}`,'Commentaire ajouté avec succès');

                },(err)=>{console.log(err)});
            }
        }
    });


    router.get('/:id/comment/edit/:comment_id',challengeExist,isOwnerComment, function (req,res) {

        let challengeObj = req.challengeObj;
        let commentObj = req.commentObj;

        let formFields = req.flash('formFields')[0] || commentObj;

        req.param.addParams({
            formError: req.flash('formError')[0],
            formFields: formFields,
            challenge: challengeObj,
            comment: commentObj,
        });

        res.render('comment/edit',req.param.connected(req));
    });

    router.post('/:id/comment/edit/:comment_id',challengeExist,isOwnerComment, function (req,res) {

        let challengeObj = req.challengeObj;
        let commentObj = req.commentObj;

        let content = req.body.content;
        let is_proof = req.body.is_proof;
        let files = req.files;

        let error_redirect_path = `challenge/${challengeObj.id}/comment/edit/${commentObj.id}`;

        let inputs = {
            content: content,
            is_proof: is_proof,
        };

        if(content === "" || !content){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu est requis.'});

        }else if(content.length > 140){

            req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{content: 'Le contenu doit faire 140 caractères maximum.'});

        }else{

            if(is_proof){

                if(is_proof != 1){

                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs, {is_proof: 'Une erreur est survenue, veuillez réessayer.'});

                }else if (!files || !files.media) {

                    req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{media: 'Une image ou vidéo est requise.'});

                }else{

                    let media = files.media;

                    if(!req.validation.image(media.mimetype) && !req.validation.video(media.mimetype)){

                        req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs, {media: 'L\'image ou la vidéo n\'est pas sous un format accepté.'});

                    }else{

                        let path = `${appRoot}/public/medias/${media.md5}.${ req.validation.getMimeFile(media.mimetype) }`;

                        media.mv(path, function(err) {
                            if (err){
                                console.log(err);
                                req.redirectHelper.redirectWithInputs(req,res,error_redirect_path,inputs,{media: 'Une erreur est survenue lors du tranfert du média, veuillez réessayer.'});
                            }else{
                                comment.insert({
                                    content: content,
                                    is_proof: 1,
                                    media: `/static/medias/${media.md5}.${ req.validation.getMimeFile(media.mimetype)}`,
                                    type_media: req.validation.getTypeFile(media.mimetype),
                                    is_accepted: 0,
                                    user_id: req.user[0].id,
                                    challenge_id: challengeObj.id,
                                    created_at: req.moment().unix(),
                                })
                                .then(() => {

                                    req.redirectHelper.redirectWithToast(req,res,`challenge/show/${challengeObj.id}`,'Commentaire ajouté avec succès');

                                },(err)=>{console.log(err)});
                            }
                          });
                    }
                }
            }else{
                comment.insert({
                    content: content,
                    is_proof: 0,
                    media: null,
                    type_media: null,
                    is_accepted: 0,
                    user_id: req.user[0].id,
                    challenge_id: challengeObj.id,
                    created_at: req.moment().unix(),
                })
                .then(() => {

                    req.redirectHelper.redirectWithToast(req,res,`challenge/show/${challengeObj.id}`,'Commentaire ajouté avec succès');

                },(err)=>{console.log(err)});
            }
        }

    return router;
}