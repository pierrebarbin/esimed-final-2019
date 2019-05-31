const DAO = require('./dao');
const comment = require(`${appRoot}/models/comment.js`);

module.exports = class CommentDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "comment"
        this.table = "comments";
    }

    findByChallenge(id){
        return new Promise((resolve, reject) => {
            this.db.all(`
            SELECT
                *
            FROM ${this.table}`,
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