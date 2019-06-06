const DAO = require('./dao');
const challenge = require(`${appRoot}/models/challenge.js`);

module.exports = class ChallengeDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "challenge";
        this.table = "challenges";

        //this.globalWhere = "is_visible = 1";
        this.globalWhere = `(is_visible = 1
                                OR c.id IN (SELECT like.challenge_id FROM likes as like WHERE like.user_id =? AND c.id=like.challenge_id)
                                OR c.id IN (SELECT chall.id FROM challenges as chall WHERE chall.user_id =? AND c.id=chall.id)
                            )`;
        this.globalWhereOne = `(is_visible = 1
                                    OR c.id IN (SELECT like.challenge_id FROM likes as like WHERE like.user_id =? AND like.challenge_id=?)
                                    OR c.id IN (SELECT chall.id FROM challenges as chall WHERE chall.user_id =? AND chall.id=?)
                                )`;
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

    updateRealized(id,realized){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table} SET is_realized=? WHERE id=?`,
                [
                    realized,
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

    findById(id,user_id){

        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT
                *
                FROM
                    ${this.table} as c
                WHERE
                    ${this.globalWhereOne}
                    AND
                    id=?
                LIMIT 1`,
                [
                    user_id,
                    id,
                    user_id,
                    id,
                    id
                ],
                function(err,challenge){
                    if (err) {
                        reject(err.message);
                    }else{console.log();
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
                    (SELECT
                        COUNT(*)
                    FROM
                        challenge_followed as f
                    WHERE
                        f.user_id=?
                        AND
                        f.challenge_id=c.id
                    )as is_fav,
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
                WHERE ${this.globalWhereOne} AND c.id=? LIMIT 1`,
                [
                    user_id,
                    user_id,
                    user_id,
                    id,
                    user_id,
                    id,
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
                    (SELECT
                        COUNT(*)
                    FROM
                        comments as com
                    WHERE
                        com.challenge_id=c.id
                        AND
                        com.is_accepted=1
                    )as nbr_accepted,
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


    findByUser(user_id,current_user_id,globalWhere = false){

        let params = [
            current_user_id,
            current_user_id,
            user_id,
        ];

        if(globalWhere){
            params = [
                current_user_id,
                current_user_id,
                current_user_id,
                current_user_id,
                user_id
            ]
        }

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
                    (SELECT
                        COUNT(*)
                    FROM
                        comments com_nbr
                    WHERE
                        com_nbr.challenge_id=c.id
                    )as nbr_comment,
                    (SELECT
                        COUNT(*)
                    FROM
                        likes as nbr_l
                    WHERE
                        nbr_l.challenge_id=c.id
                    )as nbr_like,
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
                WHERE ${ globalWhere ? this.globalWhere + ' AND ' : '' } user_id=?`,
                params,
                (err, challenges) => {

                    if(err){
                        reject(err);
                    }

                    resolve(challenges);
                });
        });
    }

    findRealizedChallengesByUser(user_id,current_user_id){

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
                LEFT JOIN
                    comments as com ON c.id = com.challenge_id
                WHERE
                    com.is_accepted=1
                    AND
                    com.user_id=?
                    AND
                    ${this.globalWhere}`,
                [
                    current_user_id,
                    current_user_id,
                    user_id,
                    current_user_id,
                    current_user_id
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
                (SELECT
                    COUNT(*)
                FROM
                    challenge_followed as f
                WHERE
                    f.user_id=?
                    AND
                    f.challenge_id=c.id
                )as is_fav,
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
                user.id,
                user.id,
                user.id,
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