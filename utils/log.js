const _ = require('lodash');
const path = require('path');
const { createLogger, transports, format } = require('winston');

/**
 * Log format :: 'timestamp :: level :: message \n metadata'
 */
const formatter = format.printf(({ level, timestamp, message, ...metadata }) => {
    let msg = `${ timestamp } :: ${ level } :: ${ message }`;
    
    if(metadata && !_.isEmpty(metadata)) {
        msg += `\n${ JSON.stringify(metadata, null, 4) }`;
    }
    
    return msg;
});

const yyyymmdd = () => (
    new Date()
        .toISOString()
        .replace(/[^\w]/g, '')
        .slice(0, 8)
);

module.exports = ( ) => (
    createLogger({
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.splat(),
                    format.timestamp(),
                    formatter
                )
            }),
            new transports.File({
                filename: path.join(process.cwd(), 'logs', `${ yyyymmdd() }.log`),
                format: format.combine(
                    format.splat(),
                    format.timestamp(),
                    formatter
                )
            })
        ]
    })
);

