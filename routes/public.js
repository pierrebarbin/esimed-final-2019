const router = require('express').Router();
const passport = require('passport');

router.get('/login', function (req,res) {
    res.render('layouts/login');
 });

router.post('/login',
    passport.authenticate('local', { successRedirect: '/product',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

module.exports = router;