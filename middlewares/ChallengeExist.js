module.exports = function(req,res,next){

    const challengedao = require(`${appRoot}/models/dao/challengedao.js`);
    const challenge = new challengedao(req.db);

    let id = req.params.id;

    challenge.findByIdWithDetails(id,req.user[0].id)
    .then((challengeObj) => {

            if(challengeObj){
                req.challengeObj = challengeObj;
                next();
            }else{
                //The challenge doesn't exist
                res.render('error/404',req.param.connected(req));
            }
    },
    (err) => {
        console.log(err);
        res.render('error/404',req.param.connected(req));
    });
}