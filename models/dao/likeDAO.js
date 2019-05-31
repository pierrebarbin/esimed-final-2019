const DAO = require('./dao');

module.exports = class LikeDAO extends DAO {
    constructor(db) {
        super(db);

        this.table = "likes";
    }

    isLiked(user_id,challenge_id){
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

    updateAmount(challenge,quantity){
        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE challenges set amount_like=? WHERE id=?`,
                [
                    challenge.amount_like + (quantity),
                    challenge.id
                ],
                function(err){
                    if (err) {
                        reject(err.message);
                    }

                    resolve(challenge.amount_like + (quantity));
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