const path = require('path');
const { MB } = require('./values');

exports.OPTIONS = {
    uploadDir: path.join(process.cwd(), 'files'),
    maxFilesSize: 25 * MB
}