/* eslint-disable no-undef */
require('dotenv').config();
//const https = require('https');
//const http = require('http');
//const fs = require('fs');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');
const { auth } = require('express-openid-connect');
const createError = require('http-errors');
//const mongoUtil = require('../util/mongo-util');
const busboy = require('connect-busboy');
const rateLimit = require('express-rate-limit');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const animRouter = require('./routes/anim');
const collectionRouter = require('./routes/collection');
const messageRouter = require('./routes/messages');

const app = express();

//const port = process.env.PORT || 3000;
//const usport = process.env.UNSECURE_LISTEN_PORT || 30000;
//const sslKey = process.env.SSL_KEY;
//const sslCert = process.env.SSL_CERT;

const config = {
    authRequired: process.env.AUTH_REQ,
    auth0Logout: process.env.AUTH_OUT,
    secret: process.env.AUTH_SECRET,
    clientID: process.env.AUTH_CLIENT_ID,
    baseURL: process.env.AUTH_BASE_URL,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
}


//app.use(jwtCheck);

app.use(auth(config));

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

app.use(busboy());

app.use(cors());
app.use(express.static(__dirname + '/'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);

//app.use(cors({origin: '*'}));
//const corsOptions = {
//    origin: '*', 
//    allowedHeaders: ['Content-Type', 'Authorization'],
//    preflightContinue: true
//}
//app.options('*', cors(corsOptions));
//app.use(function (req, res, next) {
    //Website you wish to allow to connect
    //console.log('Access Control header preflight thingy');
    //console.dir(req);
//    res.header('Access-Control-Allow-Origin', '*');
//    next();
//});

//const options = {
//    key: sslKey ? fs.readFileSync(sslKey) : null, // Replace with the path to your key
//    cert: sslCert ? fs.readFileSync(sslCert) : null // Replace with the path to your certificate    
//}


app.use('/.netlify/functions/server/account', accountRouter);
app.use('/.netlify/functions/server/anim', animRouter);
app.use('/.netlify/functions/server/collection', collectionRouter);
app.use('/.netlify/functions/server/messages', messageRouter);
app.use('/.netlify/functions/server/', indexRouter);

app.use(function(req, res, next){
    next(createError(404));
});

//app.use(function(err, req, res){
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'development' ? err : {};

//    res.status(err.status || 500);
//    res.send('Unknown server error');
//});

//http.createServer(app).listen(`${usport}`, () => {
//    console.log('Server listening unsecured on port ' + usport);
//});

//https.createServer(options, app).listen(port,() => {
//    console.log('Server listening on port ' + port);
//});

/*
mongoUtil.connectToServer((err) => {
    if(err){
        console.error(err);
    }
});
*/
//app.listen(port, () => {
//    console.log("listening on port " + port);
//});

module.exports = app;
module.exports.handler = serverless(app);
