const DAO = require('./dao');
const challenge = require(`${appRoot}/models/challenge.js`);

module.exports = class ChallengeDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "challenge";
        this.table = "challenges";

        this.globalWhere = "is_visible = 1";
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

    delete(id){
        let that = this;

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

    visibility(id,visibility){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET is_visible=? WHERE id=?`,
                [
                    visibility,
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
            this.db.all(`SELECT * FROM ${this.table} WHERE ${this.globalWhere} AND id=? LIMIT 1`,
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

    findByIdWithDetails(id,user_id){

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT
                (SELECT
                        COUNT(*)
                    FROM
                        likes as l
                    WHERE
                        l.user_id=?
                        AND
                        l.challenge_id=c.id
                    )as is_liked,
                    c.id,
                    c.content,
                    c.is_realized,
                    c.is_visible,
                    c.amount_like,
                    c.created_at,
                    u.id as user_id,
                    u.pseudo as user_pseudo
                FROM ${this.table} as c
                LEFT JOIN
                    users as u ON c.user_id = u.id
                WHERE ${this.globalWhere} AND c.id=? LIMIT 1`,
                [
                    user_id,
                    id
                ],
                function(err,challenge){
                    if (err) {
                        reject(err.message);
                    }else{
                         if(challenge.length === 0) {
                            resolve(undefined);
                        }
                        else {
                            resolve(challenge[0]);
                        }
                    }
                });
        });
    }

    findOneByUser(id,user_id){

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT
                (SELECT
                        COUNT(*)
                    FROM
                        likes as l
                    WHERE
                        l.user_id=?
                        AND
                        l.challenge_id=c.id
                    )as is_liked,
                    (SELECT
                        COUNT(*)
                    FROM
                        comments as com
                    WHERE
                        com.user_id=?
                        AND
                        com.challenge_id=c.id
                    )as is_commented,
                    c.id,
                    c.content,
                    c.is_realized,
                    c.is_visible,
                    c.amount_like,
                    c.created_at,
                    u.id as user_id,
                    u.pseudo as user_pseudo
                FROM ${this.table} as c
                LEFT JOIN
                    users as u ON c.user_id = u.id
                WHERE c.id=? AND user_id=? LIMIT 1`,
                [
                    user_id,
                    user_id,
                    id,
                    user_id
                ],
                function(err,challenge){
                    if (err) {
                        reject(err.message);
                    }else{
                        if(challenge.length === 0) {
                            resolve(undefined);
                        }
                        else {
                            resolve(challenge[0]);
                        }
                    }
                });
        });
    }


    findByUser(user_id){

        return new Promise((resolve, reject) => {
            this.db.all(`SELECT
                (SELECT
                        COUNT(*)
                    FROM
                        likes as l
                    WHERE
                        l.user_id=?
                        AND
                        l.challenge_id=c.id
                    )as is_liked,
                    (SELECT
                        COUNT(*)
                    FROM
                        comments as com
                    WHERE
                        com.user_id=?
                        AND
                        com.challenge_id=c.id
                    )as is_commented,
                    c.id,
                    c.content,
                    c.is_realized,
                    c.is_visible,
                    c.amount_like,
                    c.created_at,
                    u.id as user_id,
                    u.pseudo as user_pseudo
                FROM ${this.table} as c
                LEFT JOIN
                    users as u ON c.user_id = u.id
                WHERE user_id=?`,
                [
                    user_id,
                    user_id,
                    user_id
                ],
                (err, challenges) => {

                    if(err){
                        reject(err);
                    }

                    resolve(challenges);
                });
        });
    }


    findAll(user,realized = false,popularity = false){

        let where = 'WHERE c.is_realized = 0';

        let orderby = 'ORDER BY c.created_at DESC';

        if(realized){
            where = 'WHERE c.is_realized = 1'
        }

        if(popularity){
            orderby = 'ORDER BY c.amount_like DESC';
        }

        return new Promise((resolve, reject) => {
            this.db.all(`
            SELECT
                (SELECT
                    COUNT(*)
                FROM
                    likes as l
                WHERE
                    l.user_id=?
                    AND
                    l.challenge_id=c.id
                )as is_liked,
                c.id,
                c.content,
                c.is_realized,
                c.is_visible,
                c.amount_like,
                c.created_at,
                u.id as user_id,
                u.pseudo as user_pseudo
            FROM ${this.table} as c
            LEFT JOIN
                users as u ON c.user_id = u.id
            ${where} AND ${this.globalWhere}
            ${orderby}`,
            [
                user.id
            ],
            (err, challenges) => {

                if(err){
                    reject(err);
                }

                resolve(challenges);
            });
        });
    }
}