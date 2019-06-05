const router = require('express').Router();

const userExist = require(`${appRoot}/middlewares/UserExist`);

module.exports = (db) => {

    const userdao = require(`${appRoot}/models/dao/userDAO.js`);
    const challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
    const user = new userdao(db);
    const challenge = new challengedao(db);


    router.get('/show/:user_id',userExist, function (req,res) {

        let userObj = req.userObj;

        challenge.findByUser(userObj.id,req.user[0].id,true)
        .then((challenges)=>{

            challenge.findRealizedChallengesByUser(userObj.id,req.user[0].id)
            .then((realized)=>{

                req.param.addParams({
                    userObj: userObj,
                    challenges: req.momentHelper.transform(challenges,'created_at'),
                    realized: req.momentHelper.transform(realized,'created_at'),
                });

                res.render('profile/show',req.param.connected(req));
            },(err) => {console.log(err)});

        },(err) => {console.log(err)});
    });

    return router;
};