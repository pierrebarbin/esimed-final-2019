const DAO = require('./dao');
const user = require(`${appRoot}/models/user.js`);

module.exports = class UserDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "user"
        this.table = "users";
    }

    insert(userObj){

        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.table}(email,password,pseudo) VALUES(?,?,?)`,
            [
                userObj.email,
                userObj.password,
                userObj.pseudo
            ],
            function(err) {
                if (err) {
                    reject(err.message);
                }else{
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID} in table ${that.table}`);
                    resolve( new user(
                        this.lastID,
                        userObj.email,
                        userObj.password,
                        userObj.pseudo
                    ));
                }
            });
        });
    }

    update(id,userObj){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET email=?, password=?, pseudo=? WHERE id=?`,
                [
                    userObj.email,
                    userObj.password,
                    userObj.pseudo,
                    id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }

    updateData(id,userObj){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET email=?, pseudo=? WHERE id=?`,
                [
                    userObj.pseudo,
                    id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }

    updatePassword(id,userObj){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET password=? WHERE id=?`,
                [
                    userObj.password,
                    id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }

    delete(id){
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.table} WHERE id=?`,
                [
                    id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }

    findById(id,cb){
        this.db.all(`SELECT * FROM ${this.table} WHERE id=? LIMIT 1`,
        [
            id
        ],
        (err, user) => {
            cb(err,user);
        });
    }

    findOne(param,cb){
        this.db.all(`SELECT * FROM ${this.table} WHERE email=? LIMIT 1`,
        [
            param.email
        ],
        (err, result) => {

            if(result.length === 0){
                cb(err, undefined);
            }else{
                cb(err, new user(
                                result[0].id,
                                result[0].email,
                                result[0].password,
                                result[0].pseudo
                            )
                );
            }
        });
    }

    findAll(){
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.table}`,
            [],
            (err, users) => {

                if(err){
                    reject(err);
                }

                resolve(users);
            });
        });
    }
}