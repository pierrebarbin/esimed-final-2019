module.exports = {

    redirectWithInputs: function(req,res,redirect,inputs,messages) {

        req.flash('formFields', inputs);
        req.flash('formError', messages);
        this.redirect(req,res,redirect);
    },

    redirectWithToast: function(req,res,redirect,message){

        req.flash('toast',message);
        this.redirect(req,res,redirect);
    },

    redirect: function(req,res,redirect){

        res.redirect(`${req.urlHelper}/${redirect}`);
    }
}