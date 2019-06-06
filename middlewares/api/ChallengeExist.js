module.exports = function(req,res,next){

    const challengedao = require(`${appRoot}/models/dao/challengedao.js`);
    const challenge = new challengedao(req.db);

    let id = req.body.challenge_id;

    challenge.findById(id,req.user[0].id)
    .then((challengeObj) => {

            if(challengeObj){
                req.challengeObj = challengeObj;
                next();
            }else{
                //The challenge doesn't exist
                res.status(404).end();
            }
    },
    (err) => {
        console.log(err);
        res.status(500).end();
    });
}