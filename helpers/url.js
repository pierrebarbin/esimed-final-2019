const setting = require(`${appRoot}/setting`);

module.exports = {

    /**
     * Add or not the port in the url
     * @param {boolean} port
     */
    base: (req,port = true) => {

        let url =  req.protocol + '://' + req.hostname

        if(port){
            return  url +':'+ setting.port;
        }

        return url;
    }
}