const jsonwebtoken = require('jsonwebtoken');

module.exports = jwt = {
    /**
     * @param {json} data 
     * @returns {string}
     */
    create: ( data ) => (
        jsonwebtoken.sign(data, process.env.JWT_SECRET)
    ),
    /**
     * @param {string} token
     * @returns {json}
     */
    verify: ( token ) => {
        try {
            return jsonwebtoken.verify(token.split(' ')[1], process.env.JWT_SECRET);
        } catch (err) {
            return null;
        }
    }
};