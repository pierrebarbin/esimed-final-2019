const passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;


module.exports = function(db){
    const UserDAO = require(`${appRoot}/models/dao/userdao.js`);
    const User = new UserDAO(db);

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local',new LocalStrategy({
        passReqToCallback : true
        },
        function(req,username, password, done) {
            User.findOne({ email: username }, function(err, user) {

            if (err) { return done(err); }

            if (!user) {
                console.log('Incorrect username');
                return done(null, false, { message: 'Identifiant incorrect.' });
            }

            if (!user.validPassword(password)) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Mot de passe incorrect.' });
            }

            console.log('All good my friend!');

                return done(null, user);
            });
        }
    ));
}