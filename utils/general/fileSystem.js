const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const log = require('../log');

let read = {};

/**
 * 
 * @param {string} filepath
 * @param {function} cb
 */ 
read.file = ( filepath, cb ) => {
    if(!fs.existsSync(filepath)) return null;
    if(!cb) return fs.readFileSync(filepath);
    if(!_.isFunction(cb)) return log().warn('The callback should be a function');
    fs.readFile(filepath, cb);
}

/**
 * 
 * @param {string} filepath
 * @param {function} cb
 */ 
read.dir = ( filepath, cb ) => {
    if(!fs.existsSync(filepath)) return null;
    if(!cb) return fs.readdirSync(filepath);
    if(!_.isFunction(cb)) return log().warn('The callback should be a function');
    fs.readdir(filepath, cb);
}

exports.read = read;

let clean = {};

// TODO: add a file cleaner

/**
 * 
 * @param {string} filepath
 * @param {function} onlyIf conditional delete if only the function returns true
 */ 
clean.dir = ( filepath, onlyIf = (file => true) ) => {
    if(fs.existsSync(filepath)) {
        let files = fs.readdirSync(filepath);
        
        files.forEach(file => {
            let filepath = path.join(filepath, file);
    
            if(file !== '.gitkeep' && onlyIf(file)) {
                if(fs.lstatSync(filepath).isFile()) {
                    fs.unlinkSync(filepath);
                } else {
                    clean.dir(filepath, onlyIf);
                    fs.readdirSync(filepath).length === 0
                        ? fs.rmdirSync(filepath)
                        : null;
                }
            }
        });
    }
}

exports.clean = clean;

