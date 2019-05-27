const sql = require('sqlite3');
const productSeeder = require(`${appRoot}/seeder/productSeeder.js`);

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

                    db.run(`CREATE TABLE IF NOT EXISTS chanllenges(
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
                        next_id integer
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
                        FOREIGN KEY (status_id) REFERENCES status (id)
                    )`);

                    if(seeder){
                        providerSeeder.seed((provider,data) => {
                            productSeeder.seed(provider._id,data,db);
                        },db);

                    }
                });
            }
        });

        return db;
    }
};



