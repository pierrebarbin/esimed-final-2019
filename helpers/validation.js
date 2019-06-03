module.exports = {

    image: function(mimeType){

        let correctMimes = ['png','jpeg','jpg','gif'];

        return this.mimeType(mimeType,correctMimes);
    },

    video: function(mimeType) {

        let correctMimes = ['mp4','mov','avi','flv','3gp'];

        return this.mimeType(mimeType,correctMimes);
    },

    mimeType: function(mimeType,correctMimes){

        let typeArray = mimeType.split('/');

        //If typeArray[0] is equal to mimeType
        //It means there is no '/' in mimeType string so it can't be valid
        if(typeArray[0] === mimeType){
            return false;
        //If the mime is a correct one
        }else if(!correctMimes.includes(typeArray[1])){
            return false;
        }else{
            return true;
        }
    },

    getTypeFile: function(mimeType){
        return mimeType.split('/')[0];
    },

    getMimeFile: function(mimeType){
        return mimeType.split('/')[1];
    }
}