module.exports = function(req,res,next){

    const commentdao = require(`${appRoot}/models/dao/commentdao.js`);
    const comment = new commentdao(req.db);

    let id = req.params.comment_id;

    comment.findOneByUser(id,req.user[0].id)
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
    });
}