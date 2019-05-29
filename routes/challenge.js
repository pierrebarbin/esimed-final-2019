const router = require('express').Router();


module.exports = (db) => {

    const challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
    const challenge = new challengedao(db);

    router.get('/', function (req,res) {

        let realized = req.query.realized === 'true' ? true : false;
        let popularity = req.query.popularity === 'true' ? true : false;

        let queries = {};

        let queryParams = ['realized','popularity'];

        queryParams.forEach((param) => {

            let query = '?';

            if( req.query[param] === 'true'){

                string = '';
                let first = true;
            }else{

                string = `${param}=true`;
                let first = false;
            }

            queryParams.forEach((param2) => {

                if(param !== param2 && req.query[param2] === 'true'){
                      if(!first){

                        let separator = string.length === 0 ? '' : '&';

                        query = query + separator + string;

                    }else{
                        query = query + string;
                        first = false;
                    }
                }

            });

            queries[param] = query;
        });

        console.log(queries);

        challenge.findAll(realized,popularity)
        .then((challenges) => {

            req.param.addParams({
                //query: query,
                challenges: req.momentHelper.transform(challenges,'created_at'),
            });

            res.render('challenge/list',req.param.connected(req));

        },(err) => {console.log(err);});
    });

    return router;
}