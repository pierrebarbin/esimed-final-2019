const DAO = require('./dao');
const challenge = require(`${appRoot}/models/challenge.js`);

module.exports = class ChallengeDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "challenge"
        this.table = "challenges";
    }

    insert(challengeObj){

        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.table}(content,is_realized,amount_like,user_id,created_at) VALUES(?,?,?,?,?)`,
            [
                challengeObj.content,
                challengeObj.is_realized,
                challengeObj.amount_like,
                challengeObj.user_id,
                challengeObj.created_at
            ],
            function(err) {
                if (err) {
                    reject(err.message);
                }else{
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID} in table ${that.table}`);
                    resolve( new challenge(
                        this.lastID,
                        challengeObj.content,
                        challengeObj.is_realized,
                        challengeObj.amount_like,
                        challengeObj.user_id,
                        challengeObj.created_at
                    ));
                }
            });
        });
    }

    update(id,value,field){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET ${field}=? WHERE id=?`,
                [
                    value,
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

    findById(id){

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.table} WHERE id=? LIMIT 1`,
                [
                    id
                ],
                function(err,challenge){
                    if (err) {
                        reject(err.message);
                    }

                    if(challenge.length === 0) {
                        resolve(undefined);
                    }
                    else {
                        resolve(challenge[0]);
                    }
                });
        });
    }

    findByUser(id,user_id){

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.table} WHERE id=? AND user_id=? LIMIT 1`,
                [
                    id,
                    user_id
                ],
                function(err,challenge){
                    if (err) {
                        reject(err.message);
                    }

                    if(challenge.length === 0) {
                        resolve(undefined);
                    }
                    else {
                        resolve(challenge[0]);
                    }
                });
        });
    }


    findAll(realized = false,popularity = false){

        let where = 'WHERE c.is_realized = 0';

        let orderby = 'ORDER BY c.created_at DESC';

        if(realized){
            where = 'WHERE c.is_realized = 1'
        }

        if(popularity){
            orderby = 'ORDER BY c.amount_like DESC';
        }

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT c.id,c.content,c.is_realized,c.amount_like,c.created_at,u.id as user_id,u.pseudo as user_pseudo
            FROM ${this.table} as c
            LEFT JOIN
                users as u ON c.user_id = u.id
            ${where}
            ${orderby}`,
            [],
            (err, challenges) => {

                if(err){
                    reject(err);
                }

                resolve(challenges);
            });
        });
    }
}