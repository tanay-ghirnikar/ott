/**
 * The schedular acts according to UTC time.
 */

const cron = require('node-cron');
const { crons } = require('../constants');

// Import jobs
const { deleteOldLogs } = require('./logs');

cron.schedule('0 0 * * *', deleteOldLogs, crons.OPTIONS);