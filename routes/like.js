const router = require('express').Router();

const challengeExist = require(`${appRoot}/middlewares/api/ChallengeExist`);

module.exports = (db) => {

    const likedao = require(`${appRoot}/models/dao/likeDAO.js`);
    const like = new likedao(db);

    router.post('/',challengeExist, function (req,res) {

        let challengeObj = req.challengeObj;

        like.isLiked(req.user[0].id,challengeObj.id)
        .then((isLiked) => {

            if(isLiked){
                like.delete(req.user[0].id,challengeObj.id)
                .then(() => {

                    like.updateAmount(challengeObj,-1)
                    .then((quantity) => {

                       res.status(200).json({status: 'deleted',quantity:quantity});
                    },(err) => {
                        console.log(err);
                        res.status(500).end();
                    });
                },(err) => {
                    console.log(err);
                    res.status(500).end();
                });
            }else{
                like.insert(req.user[0].id,challengeObj.id)
                .then(() => {

                    like.updateAmount(challengeObj,1)
                    .then((quantity) => {

                       res.status(200).json({status: 'inserted',quantity:quantity});
                    },(err) => {
                        console.log(err);
                        res.status(500).end();
                    });
                },(err) => {
                    console.log(err);
                    res.status(500).end();
                });
            }
        },(err) => {
            console.log(err);
            res.status(500).end();
        });
    });

    return router;
}