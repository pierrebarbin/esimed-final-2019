const router = require('express').Router();


module.exports = (db) => {

    router.get('/', function (req,res) {

        res.render('challenge/list',req.param.connected(req));
    });

    return router;
}