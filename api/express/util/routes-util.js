const mongoUtil = require('../util/mongo-util');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

module.exports = {
    jwtCheck: (force) => {
        return jwt({
            secret: jwks.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: 'https://dev-09xhkep2.eu.auth0.com/.well-known/jwks.json'
            }),
            audience: process.env.AUTH_AUDIENCE,
            issuer: 'https://dev-09xhkep2.eu.auth0.com/',
            algorithms: ['RS256'],
            credentialsRequired: force

        })
    },
    hasContact: async (requser, animuser) => {
        const db = await mongoUtil.getDb();
        let hasContact = 0;
        try{
            hasContact = await db.collection('Collection').countDocuments({userid: animuser, contacts : [ {userid: requser} ]});
        }catch(error){
            console.error(error);
        }
        console.log("hasContact " + hasContact);
        return hasContact;
    },
    respondWithPermission: (hasPermission, res, body) => {
        hasPermission ? res.status(200).send(body) 
            :  res.status(403).send("Current user does not have permission to view this resource");
            
    }
}