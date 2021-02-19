const path = require('path');
const { general } = require('../utils');
const { values } = require('../constants');

/**
 * 
 * @param {string} filename 
 * @returns {boolean}
 */
const isLogOld = ( filename ) => {
    let now = new Date();
    
    let year = parseInt(filename.slice(0, 4));
    let month = parseInt(filename.slice(4, 6));
    let date = parseInt(filename.slice(6, 8));

    let then = new Date(year, month-1, date);

    let differenceInDays = (now - then)/values._InMilliseconds.days>>0;

    return differenceInDays > 30;
}

exports.deleteOldLogs = () => {
    general
        .fileSystem
        .clean
        .dir(
            path.join(process.cwd(), 'logs'),
            isLogOld
        );
};