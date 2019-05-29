const moment = require('moment');

module.exports = {

    transform: function(collection,attribute){

        collection.forEach(element => {

            if(this.diffWeeksFormNow(moment.unix(element[attribute])) < 1){

                element[attribute] = moment.unix(element[attribute]).fromNow();

            }else{
                this.attributeToFormat(element,attribute,'DD/MM/YYYY');
            }
        });

        return collection;
    },

    attributeToFormat: function(element,attribute,format){
        element[attribute] = moment.unix(element[attribute]).format(format);
    },

    collectionAttributeToFormat: function(collection,attribute,format) {

        collection.forEach(element => {
           this.attributeToFormat(element,attribute,format);
        });

        return collection;
    },

    diffHoursFormNow: function(date){
        return moment.duration(moment.unix(moment().unix()).diff(date)).asHours();
    },

    diffDaysFormNow: function(date){
        return moment.duration(moment.unix(moment().unix()).diff(date)).asDays();
    },

    diffWeeksFormNow: function(date){
        return moment.duration(moment.unix(moment().unix()).diff(date)).asWeeks();
    },
}