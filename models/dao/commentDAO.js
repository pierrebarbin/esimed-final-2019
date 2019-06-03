const DAO = require('./dao');
const comment = require(`${appRoot}/models/comment.js`);

module.exports = class CommentDAO extends DAO {
    constructor(db) {
        super(db);

        this.model = "comment"
        this.table = "comments";
    }

    insert(commentObj){

        let that = this;

        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.table}(content,is_proof,media,type_media,is_accepted,user_id,challenge_id,created_at) VALUES(?,?,?,?,?,?,?,?)`,
            [
                commentObj.content,
                commentObj.is_proof,
                commentObj.media,
                commentObj.type_media,
                commentObj.is_accepted,
                commentObj.user_id,
                commentObj.challenge_id,
                commentObj.created_at
            ],
            function(err) {
                if (err) {
                    reject(err.message);
                }else{
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID} in table ${that.table}`);
                    resolve( new comment(
                        this.lastID,
                        commentObj.content,
                        commentObj.is_proof,
                        commentObj.media,
                        commentObj.type_media,
                        commentObj.is_accepted,
                        commentObj.user_id,
                        commentObj.challenge_id,
                        commentObj.created_at
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

    updateProof(id,commentObj){
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.table}
                SET
                    content=?,
                    is_proof=?,
                    media=?,
                    type_media=?
                WHERE
                    id=?`,
                [
                    commentObj.content,
                    commentObj.is_proof,
                    commentObj.media,
                    commentObj.type_media,
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

    findOneByUser(id,user_id){

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

    findByChallenge(challenge_id){
        return new Promise((resolve, reject) => {
            this.db.all(`
            SELECT
                c.id,
                c.content,
                c.is_proof,
                c.created_at,
                c.media,
                c.type_media,
                c.is_accepted,
                u.id as user_id,
                u.pseudo as user_pseudo
            FROM
                ${this.table} as c
            LEFT JOIN
                users as u ON c.user_id=u.id
            WHERE
                challenge_id=?
            ORDER BY
                c.created_at DESC`,
            [
                challenge_id
            ],
            (err, comments) => {

                if(err){
                    reject(err);
                }

                resolve(comments);
            });
        });
    }
}