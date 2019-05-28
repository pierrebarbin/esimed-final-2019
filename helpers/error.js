module.exports = {

    redirectWithInputs: function(req,res,redirect,inputs,messages) {

        req.flash('formFields', inputs);
        req.flash('formError', messages);
        res.redirect(`${req.urlHelper}/${redirect}`);
    }
}