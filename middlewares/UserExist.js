module.exports = function(req,res,next){

    const userdao = require(`${appRoot}/models/dao/userdao.js`);
    const user = new userdao(req.db);

    let user_id = req.params.user_id;

    user.findByIdWithDetails(user_id)
    .then((userObj) => {

            if(userObj){
                req.userObj = userObj;
                next();
            }else{
                //The user doesn't exist
                res.render('error/404',req.param.connected(req));
            }
    },
    (err) => {
        console.log(err);
        res.render('error/404',req.param.connected(req));
    });
}