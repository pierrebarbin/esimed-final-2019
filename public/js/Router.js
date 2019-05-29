class Router {
    constructor() {

        this.url = new URL(window.location.href);
        this.storageKey = 'router-storage-flash';
    }

    /**
     * Public functions
     */

     /**
      * Retrun this current url origin
      */
    origin(){
        return this.url.origin;
    }

    /**
     * Retrun this current url pathname
     */
    pathname(){
        return this.url.pathname;
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
            this.setFlash({message:flashMessage,type:flashType});
        }

        window.location.href = location;
    }

    /**
     * Private functions
     */

    /**
     * Set flash message
     * @param {object} object
     */
    setFlash(object){
        sessionStorage.setItem(this.storageKey,JSON.stringify(object));
    }

    /**
     * Get flash message and display it
     */
    getFlash(){
        let flashCompressed = sessionStorage.getItem(this.storageKey);

        if(flashCompressed !== null){
            let flash = JSON.parse(flashCompressed);

            new Toaster(flash.message,flash.type);

            sessionStorage.removeItem(this.storageKey);
        }
    }
}