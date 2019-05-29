const moment = require('moment');

module.exports = class ChallengeSeeder {
    constructor() {}

    static seed(cb,db,user_id){
        let challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
        let challenge = new challengedao(db);

        let challenges = [
            ['Faire le poirier avec un katana dans la bouche',0,7,user_id,moment().unix()],
            ['Déclencer une avalance avec sa langue',0,0,user_id,moment().unix()],
            ['Dab un crocodile',1,0,user_id,moment().unix()],
            ['Faire la course avec un tigre',0,5,user_id,moment().unix()],
        ];

        for(let i = 0; i < challenges.length ;i++){

            challenge.insert( {
                content: `${challenges[i][0]}`,
                is_realized:`${challenges[i][1]}`,
                amount_like:`${challenges[i][2]}`,
                user_id:`${challenges[i][3]}`,
                created_at:`${challenges[i][4]}`,
            })
            .then((challengeObj) => {
                cb(challengeObj);
            },
            (err) => {
                console.log(err);
            });
        }
    }
}