const bcrypt = require('bcrypt');

module.exports = class User {
    constructor(id,email,password,pseudo) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.pseudo = pseudo;
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password)
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }

    static instanciate(obj){
        return new User( obj.id,
            obj.email,
            obj.password,
            obj.pseudo);
    }
}