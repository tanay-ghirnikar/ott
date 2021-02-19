require('dotenv').config();

require('./cronJobs');
const _ = require('lodash');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const { wrap, log } = require('./utils');
const { routes, middlewares } = require('./api');
const { mongo, cors, multiparty } = require('./constants');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multipart(multiparty.OPTIONS));

app.use(require('cors')(cors.OPTIONS));

app.use('*', (req, res, next) => {
    let metadata = {};
    
    if(req.user && !_.isEmpty(req.user))
        metadata.user = req.user;
    if(req.body && !_.isEmpty(req.body))
        metadata.body = req.body;
    if(req.query && !_.isEmpty(req.query))
        metadata.query = req.query;
    if(req.files && !_.isEmpty(req.files))
        metadata.files = req.files;
    
    log().info(`${ req.method } @ [ '${ req.originalUrl.split('?')[0] }' ]`, metadata);
    next();
});

app.use('/', routes.base);

app.use('*', (req, res) => wrap.response(res).notFound());

let server = http.createServer(app);

mongoose.connect(mongo.URL, mongo.OPTIONS);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    log().info(`Successful MongoDB [ '${ process.env.MONGODB_URL }' ] connection!`);
    server.listen(parseInt(process.env.PORT), () => {
        log().info(`Application deployed on Port [ ${ process.env.PORT } ]`);
    });
});
