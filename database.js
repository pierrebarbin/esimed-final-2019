const sql = require('sqlite3');
const userSeeder = require(`${appRoot}/database/seeder/userSeeder.js`);
const challengeSeeder = require(`${appRoot}/database/seeder/challengeSeeder.js`);
const commentSeeder = require(`${appRoot}/database/seeder/commentSeeder.js`);

module.exports = class Database {
    constructor() {}

    static db(seeder = falses){
        var db = new sql.Database(__dirname + '/mabase.db3',
        (err) => {
            if(err){
                console.log(err);
            }else{
                console.log("Base ouverte");
                db.serialize(() => {

                    db.run(`CREATE TABLE IF NOT EXISTS users(
                        id integer PRIMARY KEY AUTOINCREMENT,
                        email text UNIQUE NOT NULL,
                        password text NOT NULL,
                        pseudo text NOT NULL
                    )`);

                    db.run(`CREATE TABLE IF NOT EXISTS challenges(
                        id integer PRIMARY KEY AUTOINCREMENT,
                        content text NOT NULL,
                        is_realized integer DEFAULT 0,
                        amount_like integer DEFAULT 0,
                        user_id integer NOT NULL,
                        created_at integer NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users (id)
                    )`);

                    db.run(`CREATE TABLE IF NOT EXISTS likes(
                        user_id integer,
                        challenge_id integer,
                        PRIMARY KEY (user_id,challenge_id),
                        FOREIGN KEY (user_id) REFERENCES users (id),
                        FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                    )`);

                    db.run(`CREATE TABLE IF NOT EXISTS challenge_followed(
                        user_id integer,
                        challenge_id integer,
                        PRIMARY KEY (user_id,challenge_id),
                        FOREIGN KEY (user_id) REFERENCES users (id),
                        FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                    )`);

                    db.run(`CREATE TABLE IF NOT EXISTS comments(
                        id integer PRIMARY KEY AUTOINCREMENT,
                        content text NOT NULL,
                        is_proof integer DEFAULT 0,
                        media text,
                        type_media text,
                        is_accepted integer DEFAULT 0,
                        user_id integer NOT NULL,
                        challenge_id integer NOT NULL,
                        created_at integer NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users (id),
                        FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                    )`);

                    if(seeder){
                        userSeeder.seed((user) => {
                            challengeSeeder.seed((challenge) => {
                                commentSeeder.seed((comment) => {

                                },db,user.id,challenge.id);
                            },db,user.id);
                        },db);

                    }
                });
            }
        });

        return db;
    }
};



