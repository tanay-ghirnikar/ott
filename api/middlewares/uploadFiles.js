const _ = require('lodash');
const path = require('path');
const { aws } = require(path.join(process.cwd(), 'utils'));

let transformFileData = ( data, prefix ) => {
    data.contentType = data.headers['content-type'];
    data = _.pick(data, [ 'path', 'name', 'contentType' ]);
    
    data.name = data.name.replace(/[^\w.]/g, '');
    data.name = `${ prefix }-${ data.name }`;
    data.name = data.name.toLowerCase();
    
    return data;
};

module.exports = uploadFiles = async (req, res, next) => {
    if(!req.body) req.body = {};
    if(!req.files) return next();

    let timestamp = new Date()
        .toISOString()
        .replace(/[^\d]/g, '');
    let user = req.user? req.user._id: 'anonymous';
    let prefix = `${ timestamp }-${ user }`;

    for(let [ key, values ] of Object.entries(req.files)) {
        if(!Array.isArray(values)) values = [ values ];
        values = values.map(value => transformFileData(value, prefix));
        req.body[key] = await aws.s3.upload(values);
    };

    return next();
}