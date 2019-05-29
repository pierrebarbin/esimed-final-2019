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
    },

    test: function(){
        let queries = {};

        let queryParams = ['realized','popularity'];

        queryParams.forEach((param) => {

            let query = '?';

            if( req.query[param] === 'true'){

                string = '';
                let first = true;
            }else{

                string = `${param}=true`;
                let first = false;
            }

            queryParams.forEach((param2) => {

                if(param !== param2 && req.query[param2] === 'true'){
                      if(!first){

                        let separator = string.length === 0 ? '' : '&';

                        query = query + separator + string;

                    }else{
                        query = query + string;
                        first = false;
                    }
                }
                console.log(query);
            });

            queries[param] = query;
        });
    }
}