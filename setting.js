module.exports = {
    port: 3000,
    secret: "esimed2019javascript",

    login: {
        successRedirect: '/challenge',
        failureRedirect: '/login'
    }
}