const log = require('./log');

/**
 * @param {express-response-object} res 
 */
exports.response = ( res ) => {
    function send(data = {}, status = 200) {
        res.status(status);
        res.json(data);
    };
    return {
        send: send,
        badRequest: data => send(data, 400),
        unauthorized: data => send(data, 401),
        notFound: data => send(data, 404),
        internalError: data => send(data, 500)
    };
}

/**
 * @param {function} asyncFUNC
 */
exports.asyncHandler = ( asyncFUNC ) => {
    return (req, res, next) => {
        asyncFUNC(req, res, next).then(res => {
        }).catch(err => {
            log().error(err.message, err);
            res.status(500).json({ err: err.message });
        });
    }
}