module.exports = {

    /**
     * Check the validity of an email
     *
     * @param {string} email
     * @return {boolean}
     */
    email: (email) => {

        let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        return re.test(email);
    }
}