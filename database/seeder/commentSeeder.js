const moment = require('moment');

module.exports = class CommentSeeder {
    constructor() {}

    static seed(cb,db,user_id,challenge_id){
        let commentdao = require(`${appRoot}/models/dao/commentDAO.js`);
        let comment = new commentdao(db);

        let comments = [
            ['Trop bien! j\'adore.',0,null,null,0,user_id,challenge_id,moment().unix()],
            ['Ce défis est trop dur wtf !',0,null,null,0,user_id,challenge_id,moment().unix()],
            ['Nul nul nul !',0,null,null,0,user_id,challenge_id,moment().unix()],
            ['Ma soeur à essayé!... on l\'enterre dimanche...',0,null,null,0,user_id,challenge_id,moment().unix()],
        ];

        for(let i = 0; i < comments.length ;i++){

            comment.insert( {
                content: `${comments[i][0]}`,
                is_proof:`${comments[i][1]}`,
                media:`${comments[i][2]}`,
                type_media:`${comments[i][3]}`,
                is_accepted:`${comments[i][4]}`,
                user_id:`${comments[i][5]}`,
                challenge_id:`${comments[i][6]}`,
                created_at:`${comments[i][7]}`,
            })
            .then((commentObj) => {
                cb(commentObj);
            },
            (err) => {
                console.log(err);
            });
        }
    }
}