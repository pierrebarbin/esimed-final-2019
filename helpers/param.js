module.exports = {

    params: {},

    anonymous: function(req) {
        return Object.assign(this.params, {
            url: req.urlHelper,
        });
    },

    connected: function(req) {

        return Object.assign(this.params, {
            user: req.user[0],
            moment: req.moment,
            url: req.urlHelper,
            setting: req.setting
        });
    },

    addParams: function(params){
        Object.assign(this.params, params);
    }
}