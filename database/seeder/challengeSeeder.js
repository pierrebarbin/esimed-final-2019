const moment = require('moment');

module.exports = class ChallengeSeeder {
    constructor() {}

    static seed(cb,db,user_id){
        let challengedao = require(`${appRoot}/models/dao/challengeDAO.js`);
        let challenge = new challengedao(db);

        let challenges = [
            ['L\'entraînement de Saitama',0,0,user_id,moment().unix()],
            ['Lancer une pétard depuis sa voiture',0,0,user_id,moment().subtract(Math.floor(Math.random() * 6) + 1  , 'd').unix()],
            ['Sauter en parachute d\'un banc',0,0,user_id,moment().subtract(Math.floor(Math.random() * 6) + 1  , 'm').unix()],
            ['Coder en en Swift uniquement avec les emojis',0,0,user_id,moment().subtract(Math.floor(Math.random() * 6) + 1  , 'M').unix()],
            ['Faire la course avec un wallaby',0,0,user_id,moment().subtract(Math.floor(Math.random() * 6) + 1  , 'Y').unix()],
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