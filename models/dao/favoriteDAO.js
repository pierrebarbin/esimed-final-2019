const DAO = require('./dao');

module.exports = class FavoriteDAO extends DAO {
    constructor(db) {
        super(db);

        this.table = "challenge_followed";
    }

    findAll(user_id){

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
            FROM challenges as c
            LEFT JOIN
                users as u ON c.user_id = u.id
            WHERE
            (is_visible = 1
                OR c.id IN (SELECT like.challenge_id FROM likes as like WHERE like.user_id =? AND c.id=like.challenge_id)
                OR c.id IN (SELECT chall.id FROM challenges as chall WHERE chall.user_id =? AND c.id=chall.id)
            )
             AND c.id IN (
                    SELECT
                        fav.challenge_id
                    FROM
                        ${this.table} as fav
                    WHERE
                        fav.user_id =?
                )
            ORDER BY created_at DESC`,
            [
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
            ],
            (err, favorites) => {

                if(err){
                    reject(err);
                }else{

                    resolve(favorites);
                }

            });
        });
    }

    isFavorited(user_id,challenge_id){
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.table} WHERE user_id=? AND challenge_id=? LIMIT 1`,
                [
                    user_id,
                    challenge_id
                ],
                function(err,like){
                    if (err) {
                        reject(err.message);
                    }

                    if(like.length > 0){
                        resolve(true)
                    }else{
                        resolve(false);
                    }
                });
        });
    }

    insert(user_id,challenge_id){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.table}(user_id,challenge_id) VALUES(?,?)`,
                [
                    user_id,
                    challenge_id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }

    delete(user_id,challenge_id){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.table} WHERE user_id=? AND challenge_id=?`,
                [
                    user_id,
                    challenge_id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve();
                });
        });
    }
}