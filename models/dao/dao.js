
module.exports = class DAO {
    constructor(db){
        this.db = db;
    }

    /**
     * Helper functions
     */

     /**
      * Transform data into object
      */
    fetchObject(fetchable,model = undefined){

        model = model || this.model;

        return new Promise((resolve, reject) => {
            if(Array.isArray(fetchable)){

                let fetchArray = [];

                fetchable.forEach(fetch => {
                    fetchArray.push(Object.assign(eval("new "+ model),fetch));
                });

                resolve(fetchArray);
            }else{
                resolve(Object.assign(eval("new "+ model),fetchable));
            }
        });
    }

}