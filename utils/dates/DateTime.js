const _ = require('lodash');
const log = require('../log');
const { values } = require('../../constants');
const timezones = require('./timezones.json');

class DateTime extends Date {
    constructor(...args) {
        super(...args);
        let adjustTimezone = Boolean(args.length)
            &&
            (
                (_.isNumber(args[0]) && args.length > 1)
                ||
                (_.isString(args[0]) && !args[0].match(/[+-]/)) 
            );
        adjustTimezone? this.setTimezone(this.getTimezoneOffset()): null;
    }

    /**
     * @param {json} data json object containing milliseconds/seconds/.../year
     * @param {int} polarity whether to add/subtract this data 
     */
    increment(data, polarity = 1) {
        for(let [ key, value ] of Object.entries(data) ) {
            if(!values._InMilliseconds[key]) {
                log().warn(`Found invalid key ${ key } with value ${ value }`);
            } else {
                this.setTime(this.getTime() + polarity * value * values._InMilliseconds[key]);
            }
        }
    }

    /**
     * @implements {increment} with reversed polarity
     * @param {json} data json object containing milliseconds/seconds/.../year
     */
    decrement(data) { this.increment(data, -1); }

    /**
     * @param {string} tz should be of the form 'Asia/Kolkata' or '[GMT/UTC]±dddd'
     * @param {int} tz should be in minutes
     */
    setTimezone(tz) {
        if(!tz)
            return log().warn('No timezone provided!');

        if( _.isNumber(tz) ) {
            if(tz > 720 || tz < -720)
                return log().warn('Value out of range [ -720, 720 ] ( ± 12 hrs )!');
            
            this.decrement({ minutes: tz });
        } else if( _.isString(tz) ) {
            if(tz.match(/^(gmt|utc)?[+-]\d{0,2}[:]?\d{0,2}$/i)) {
                let sign = tz.replace(/^[+-]/g, '') === '-' ? -1: 1;

                tz = tz.replace(/^\d/g, '');
                this.decrement({
                    minutes: sign * parseInt(tz.slice(-2)),
                    hours: sign * parseInt(tz.slice(-4, -2))
                });
            } else if(timezones[tz]) {
                log().warn(`Shifting to '${ timezones[tz].label }' timezone!`);
                this.decrement(timezones[tz].offset);
            } else {
                return log().warn('Invalid value for timezone argument!');
            }
        } else {
            return log().warn('Invalid type for timezone argument!');
        }
    }
}

module.exports = DateTime;