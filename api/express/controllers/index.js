
const mongoUtil = require('../util/mongo-util');
const coll = require('../controllers/collection');
const auth = require('../util/auth-util');
const fetch = require('node-fetch');
//const ESAPI = require('node-esapi');

module.exports = {
    addLogin: async (data, res) => {
        let login;
        if(await module.exports.hasExistingCollection(data)){
            console.log('collection exists');
            try{
                login = await module.exports.addLoggingEntry(data, "logins");
            }catch(error){
                console.error(error)
            }
            if(login){
                console.log("login ok, returning 201");
                res.status(201).send({userid: data.userid, login: login});
            }else{
                console.error("login not ok, returning 500");
                res.status(500).send("Error recording login");
            }
        }else{
            console.log('creating collection');
            coll.createCollection(data, res);
        }
    },
    addLogout: async (data, res) => {
        if(module.exports.hasExistingCollection(data)){
            const logout = await module.exports.addLoggingEntry(data, "logouts");
            if(logout){
                res.status(201).send({userid: data.userid, logout: logout});
            }else{
                res.status(500).send("Error recording logout");
            }
        }else{
            res.status(500).send("User doesn't appear to exist");
        }
    },
    addLoggingEntry: async (data, operation) => {
        const db = mongoUtil.getDb();
        const val = new Date();
        let obj = {};
        obj[operation] = val;
        let result;
        try{
            result = await db.collection('Collection')
                .updateOne({userid: data.userid}, {$addToSet: obj});
            if(result && result.modifiedCount){
                console.dir(result);
            }
        }catch (error) {
            console.error(error);
            return false;
        }
        return result;
    },
    cleanTestSignup: () => {
        const db = mongoUtil.getDb();
        db.collection('Collection').deleteOne({'userid' : "123456789012345678901111"});    

    },
    hasExistingCollection: async (data) => {
        let count;
        const db = mongoUtil.getDb();
        try{
            count = await db.collection('Collection').countDocuments({userid: data.userid});
        }catch (error) {
            console.error(error);
        }
        console.log('count: ' + count);
        if(count == 0){
            return false;
        }else{
            return true;
        }
    },
    getIndex: (req, res) => {
        let isAuthenticated = false;    
        if(req.oidc.isAuthenticated){
            isAuthenticated = true;
        }
        res.status(200).send({isAuthenticated: isAuthenticated});
    },
    isValidLoginReqBody: (req) => {
        return module.exports.isValidSignupReqBody(req);
    },
    isValidLogoutReqBody: (req) => {
        console.dir(req);
        return module.exports.isValidLoginReqBody(req);
    },
    isValidSignupReqBody: (body) => {
        const userid = body.userid;
        const email = body.email;//ESAPI.encoder().encodeForJavascript(body.email);
        const username = body.username ? body.username : '';//ESAPI.encoder().encodeForJavascript(body.username) : '';
        if(email && typeof email == 'string' && email.length > 0 && email.indexOf('@') > -1
            && email.indexOf('.') > -1
            && userid && typeof userid == 'string' && userid.length == 24 
            && typeof username == 'string'){
            console.log("isValidSignupReqBody: " + userid);
            return {isValid: true, userid: userid, email: email, username: username};
        }else{
            console.log("isNOTValidSignupBody");
            return {isValid: false};
        }
    },
    resendVerification: async (req, res) => {
        const endpoint = `https://${process.env.AUTH_DOMAIN}/api/v2/jobs/verification-email`;
        const token = await auth.getAuthManToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        const body = JSON.stringify(req.body);
        const response = await fetch(endpoint, {method: 'POST', headers: headers, body: body});
            const data = await response.json();
            console.dir(data);
            if(data.type){
                res.status(200).send(`Verification email resent: ${data.id}`);
            }else{
                res.status(500).send("There was a problem sending the verification email");
            }
    }
}