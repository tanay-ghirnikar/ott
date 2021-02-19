const path = require('path');
const bcryptjs = require('bcryptjs');

const { bcrypt } = require(path.join(process.cwd(), 'constants'));

module.exports = cryptography = {
    /**
     * @param {string} string
     * @returns {string}
     */
    encrypt: ( string ) => (
        bcryptjs.hashSync(string, bcrypt.SALT_LENGTH)
    ),
    /**
     * @param {string} string 
     * @param {string} hash
     * @returns {boolean}
     */
    match: ( string, hash ) => (
        bcryptjs.compareSync(string, hash)
    )
}