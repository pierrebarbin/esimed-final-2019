module.exports = function(req,res,next){

    const commentdao = require(`${appRoot}/models/dao/commentdao.js`);
    const comment = new commentdao(req.db);

    let comment_id = req.params.comment_id;

    let challengeObj = req.challengeObj;

    comment.findOneByChallenge(comment_id,challengeObj.id)
    .then((commentObj) => {

            if(commentObj){
                req.commentObj = commentObj;
                next();
            }else{
                //The comment doesn't exist
                res.render('error/404',req.param.connected(req));
            }
    },
    (err) => {
        console.log(err);
        res.render('error/404',req.param.connected(req));
    });
}