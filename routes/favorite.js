const router = require('express').Router();

const challengeExist = require(`${appRoot}/middlewares/api/ChallengeExist`);

module.exports = (db) => {

    const favoritedao = require(`${appRoot}/models/dao/favoriteDAO.js`);
    const favorite = new favoritedao(db);

    router.get('/', function (req,res) {

        favorite.findAll(req.user[0].id)
        .then((favorites) => {

            req.param.addParams({
                favorites: req.momentHelper.transform(favorites,'created_at'),
            });

            res.render('favorite/list',req.param.connected(req));

        },(err) => {console.log(err);});
    });


    router.post('/toggle',challengeExist, function (req,res) {

        let challengeObj = req.challengeObj;

        favorite.isFavorited(req.user[0].id,challengeObj.id)
        .then((isfavorited) => {

            if(isfavorited){
                favorite.delete(req.user[0].id,challengeObj.id)
                .then(() => {

                    res.status(200).json({status: 'not_fav'});
                },(err) => {
                    console.log(err);
                    res.status(500).end();
                });
            }else{
                favorite.insert(req.user[0].id,challengeObj.id)
                .then(() => {

                    res.status(200).json({status: 'fav'});
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