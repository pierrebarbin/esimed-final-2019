class Router {
    constructor() {

        this.url = new URL(window.location.href);

        this.storageFlashKey = 'router-storage-flash';
        this.storageQueryStringKey = 'router-storage-query-string';
    }

    /**
     * Public functions
     */

     /**
      * Retrun the current url origin
      */
    origin(){
        return this.url.origin;
    }

    /**
     * Retrun the current url pathname
     */
    pathname(){
        return this.url.pathname;
    }

    fullUrl(queryString = false){

        if(queryString){
            return this.url.href;
        }else{
            return this.origin() + this.pathname();
        }
    }

    /**
     * Return the current url query string
     */
    queryString(){
        return this.url.search;
    }

    /**
     * Get pathname at given index
     * @param {integer} index
     */
    pathnameIndex(index){

        if(!Number.isInteger(index)){
            throw "PathnameIndex: index must be an integer";
        }

        let pathname = this.pathname();

        let paths = pathname.split('/');

        return paths[index];
    }

    /**
     * Javascript redirection wrapper
     * @param {string} location
     */
    redirect(options = {}){

        let location = options.location || this.url;
        let flashMessage = options.flashMessage || null;
        let flashType = options.flashType || "success";

        if(flashMessage !== null){
            this.setStorageFlash({message:flashMessage,type:flashType});
        }

        window.location.href = location;
    }

    persistCurrentQueryString(){

        let data = this.queryString();

        if(data === ""){
            data = undefined;
        }else{
            data = {query: data};
        }

        this.setStorageQueryString(data);
    }

    queyStringStorageKeyExists(){

        if (sessionStorage.getItem(this.storageQueryStringKey)
            && sessionStorage.getItem(this.storageQueryStringKey) !== 'undefined'
            && sessionStorage.getItem(this.storageQueryStringKey) !== undefined) {

            return true;
        }
        return false;
    }

    /**
     * Set flash message
     * @param {object} object
     */
    setStorageFlash(object){
        sessionStorage.setItem(this.storageFlashKey,JSON.stringify(object));
    }

    /**
     * Get flash message and display it
     */
    getStorageFlash(){
        let flashCompressed = sessionStorage.getItem(this.storageFlashKey);

        if(flashCompressed !== null){
            let flash = JSON.parse(flashCompressed);

            new Toaster(flash.message,flash.type);

            sessionStorage.removeItem(this.storageFlashKey);
        }
    }

    /**
     * Set storage query string
     * @param {object} object
     */
    setStorageQueryString(object){
        sessionStorage.setItem(this.storageQueryStringKey,JSON.stringify(object));
    }

    /**
     * get storage query string
     */
    getStorageQueryString(){
        let compressed = sessionStorage.getItem(this.storageQueryStringKey);

        if(compressed !== null){
            let queryString = JSON.parse(compressed);

            this.removeStorageQueryString();

            let location = `${this.url}${queryString.query}`;

            this.redirect({location:location})
        }
    }

    removeStorageQueryString(){
        sessionStorage.removeItem(this.storageQueryStringKey);
    }
}