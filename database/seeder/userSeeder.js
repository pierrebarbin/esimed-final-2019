let UserClass = require(`${appRoot}/models/user.js`);

module.exports = class UserSeeder {
    constructor() {}

    static seed(cb,db){
        let userdao = require(`${appRoot}/models/dao/userdao.js`);
        let user = new userdao(db);

        let users = [
            ['tomo@gmail.com',UserClass.hashPassword("azerty"),'Tomo'],
            ['pierre@gmail.com',UserClass.hashPassword("azerty"),'Pierre'],
        ];

        for(let i = 0; i < users.length ;i++){

            user.insert( { email: `${users[i][0]}`,password:`${users[i][1]}`,pseudo:`${users[i][2]}`})
            .then((userObj) => {
                cb(userObj);
            },
            (err) => {
                console.log(err);
            });
        }
    }
}