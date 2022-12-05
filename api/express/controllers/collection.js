const mongoUtil = require('../util/mongo-util');
const routeUtil = require('../util/routes-util');
const transactions = require('../transactions/collection');
const { getAccount, deleteCollection } = require('../transactions/collection');
const { getDb } = require('../util/mongo-util');

const PUBLIC = 0; const PERMISSION = 1; const PRIVATE = 2;

const file = 'controllers/collection.js: ';
module.exports = {
    createCollection: async (colObj, res) => {
        const sig = 'createCollection: ';
        console.debug(`${file}${sig}`);
        const email = colObj.email;
        const db = await mongoUtil.getDb();
        let count;
        try{
            count = await db.collection('Collection').countDocuments({ email: email});
        }catch (error) {
            console.error(error);
            res.status(500).send("Error creating new user");
        }
        console.debug("count: " + count);
        if(count == 0){
            const collection = module.exports.getNewCollectionFromReq(colObj);
            let commit;
            try{
                //result = await db.collection('Collection').insertOne(collection);
                commit = await transactions.newCollection(collection, res);
            }catch(error){
                console.error(error);
                res.status(500).send("Error creating new user");
            }
            if(commit && commit.ok){
                let returnCol;
                try{
                    returnCol = await db.collection('Collection').findOne({'userid' : colObj.userid});
                    console.debug("Returning new collection");
                    res.status(201).send(returnCol); 
                }catch{
                    res.status(500).send("Error retrieving new user info (but the user should exist)");
                }
            }else{
                res.status(500).send("Error creating new user");
            }
        }else{
            res.status(500).send("A Collection already exists for that email");
        }        
    },
    getNewCollectionFromReq: (colObj) => {
        const sig = 'getNewCollectionFromReq: ';
        console.debug(`${file}${sig}`);
        const joined = new Date();
        return { 
            userid: colObj.userid ? colObj.userid : "ERROR",
            email: colObj.email ? colObj.email : "ERROR",
            username: colObj.username ? colObj.username : 'Onion',
            joined: joined,
            privacy: colObj.privacy ? colObj.privacy : 0,
            contacts: colObj.contacts ? colObj.contacts : {userid: colObj.userid, contacts: []},
            notices: colObj.notices ? colObj.notices : {userid: colObj.userid, notices: []},
            anims: colObj.anims ? colObj.anims : {userid: colObj.userid, anims: []},
            logins: colObj.logins ? colObj.logins : [],
            logouts: colObj.logouts ? colObj.logouts : []
        };
    },
    /**
    postNewCollection: async (collection, res) => {
        console.debug('postNewCollection');
        const db = mongoUtil.getDb();
        const collectionToPost = await module.exports.getCollectionToPost(collection);
        db.collection('Collection')
            .insertOne(collectionToPost, (err, result) => {
                if(err) res.status(500).send(err);
                if(result) res.status(201).send(result);
            }
        );
    },*/
    deleteCollection: async (req, res) => {
        const sig = 'deleteCollection: ';
        console.debug(`${file}${sig}`);
        const userid = req.params[0];
        const requser = req.user ? req.user.sub.replace('auth0|', '') : null;
        if(requser !== userid){
            res.status(403).send("Requester does not have mission to delete this resource");
            return;
        }
        if( await module.exports.isExistingCollection({userid: userid})){
            try{
                await deleteCollection(userid);
                res.status(200).send("Account deleted");
/*                await db.collection('Collection')
                    .deleteOne({userid: userid}, (err, result) => {
                        if(result && result.deletedCount === 1){
                            console.debug("Collection deleted");
                            res.status(200).send("Account deleted");
                        }else{
                            console.dir(result);
                        }
                    });
*/
            }catch(error){
                console.error(error);
                res.status(500).send("Error deleting the resource");
            }
        }   
    },
    getCollection: async (req, res) => {
        const sig = 'getCollection: ';
        console.debug(`${file}${sig}`);
        //const requser = req.user.sub.replace('auth0|', '');
        try{
            //generate a sample collection
            //this algorithm is not great but will be fine 
            //to get started
             module.exports.getAnimSample(null, res);
        }catch(error){
            console.error(error);
            res.status(500).send(error);
        }
    },
    //using conditions param as a placeholder for the moment
    getAnimSample: async (conditions, res) => {
        const sig = 'getAnimSample: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        let collection = [];
        //just getting all public anims for now
        
        await db.collection('Anims')
            //would prefer to filter out anims by privacy,
            //but having to to do it below after array is found
            .find({
                "anims": { $elemMatch: {
                    privacy: {$eq: 0},
                }
            }}, 
            {
                projection: {_id: 0,"anims": 1},
                limit: 100,
                //skip: conditions.page * 10,
            })
            .sort({_id: 1})
            .toArray((err, result) => {
                if(err){
                    console.error(err);
                    res.status(500).send(err);
                }
                if(result){
                    result.forEach((resultSet) => {
                        const sample = resultSet.anims.filter((a) => {
                            return a.privacy === 0;
                        });
                        collection.push(sample[sample.length-1]);
                    });
                    console.dir(collection);
                    //currently returning most recent public anims of ever user
                    res.status(200).send(collection);
                }
            });
    },
    getCollectionById: async (req, res) => {
        const sig = 'getCollectionById: ';
        console.debug(`${file}${sig}`);
        //const db = await mongoUtil.getDb();
        const userid = req.params[0];
        const requser = req.user ? req.user.sub.replace('auth0|', '') : 'temp';
        try{

            await getAccount(userid).then((result) => {
                if(result.ok){
                    console.debug('result');
                    console.dir(result);
                    const collection = result.account;
                    //filter the result based on ownership, contact/privacy
                    module.exports.setGetCollectionResponse(collection, requser, res)
                //}else if(err){
                //    console.debug(err);
                //    res.status(500).send(err);
                }else{
                    res.status(404).send('No existing account found');
                }
                //module.exports.setGetCollectionResponse(result, requser, res);
            })
/*
            await db.collection('Collection').findOne({
                'userid': userid
            }, (err, result) => {
                if(result){
                    console.debug('result');
                    console.dir(result);
                    const collection = result;
                    //filter the result based on ownership, contact/privacy
                    module.exports.setGetCollectionResponse(collection, requser, res)
                }else if(err){
                    console.debug(err);
                    res.status(500).send(err);
                }else{
                    res.status(404).send('No existing account found');
                }
            });
*/
        }catch(error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    getCollectionToPost: (collection) => {
        //stub
        const sig = 'getCollectionToPost: ';
        console.debug(`${file}${sig}`);
        return collection;
    },
    hasValidGetParam: (req) => {
        const sig = 'hasValidGetParam: ';
        console.debug(`${file}${sig}`);
        return req.params[0] ? (typeof req.params[0] == 'string') : false;
    },
    isExistingCollection: async (collection) => {
        const sig = 'isExistingCollection: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        let exists = 0;
        try{
            exists = await db.collection('Collection')
                .countDocuments({userid: collection.userid});
                console.debug("Collection EXISTS");
        }catch(error){
            console.debug(error);
        }
        return exists;
    },
    isValidPostReqBody: (req) => {
        const sig = 'isValidPostReqBody: ';
        console.debug(`${file}${sig}`);
        if(!req.user){
            return {isValid: false, error: {code: 403, message: "User is not authorized"}};
        }
        const body = req.body;
        console.dir(body);
        const requser = req.user.sub.replace('auth0|', '');
        console.debug(`${requser} =? ${body.userid}`);
        console.debug(`${requser} =? ${body.targetUserid}`);
        console.debug(`${requser} =? ${body.reqUserid}`);
        if(body.userid && typeof body.userid == 'string' && (body.userid === requser || body.targetUserid === requser || body.reqUserid === requser)){
            if((body.username && typeof body.username == 'string') || !body.username){
                return {
                    isValid: true,
                    userid: body.userid
                }
            }else{
                return {isValid: false, error: {code: 400, message: "Bad request"}};        
            }
        }else if(body.userid !== requser){
            return {isValid: false, error: {code: 403, message: "User can't change other user's collections"}};
        }else{
            return {isValid: false, error: {code: 400, message: "Bad request, no user id in request body"}}
        }
    },
    setGetCollectionResponse: async (collection, requser, res) => {
        const sig = 'setGetCollectionResponse: ';
        console.debug(`${file}${sig}`);
        if(collection){
            if(collection.userid === requser){
                console.debug(collection.userid + " === " + requser);
                console.debug("setGetCollectionResponse: requester is owner");
                const response = await module.exports.getCollectionResponseBody(collection, PRIVATE);
                res.status(200).send(response);
            }else if(await routeUtil.hasContact(collection.userid, requser)){
                console.debug("setGetCollectionResponse: requester is contact of owner");
                const response = await module.exports.getCollectionResponseBody(collection, PERMISSION);
                res.status(200).send(response);
            }else{
                console.debug("setGetCollectionResponse: requester is unknown to owner");
                console.debug(collection.userid + "::" + requser);
                const response = await module.exports.getCollectionResponseBody(collection, PUBLIC);
                res.status(200).send(response);
            }
        }else{
            //so if a user doesn't exist, it could be a generated, "browse" id,
            //or maybe even should be
            res.status('404').send("Couldn't find that user");
        }
    },
    getCollectionResponseBody: async (collection, contactLevel) => {
        const sig = 'getCollectionResponseBody: ';
        console.debug(`${file}${sig}`);
        let response = {
            userid: collection.userid,
            username: collection.username,
            joined: collection.joined
        }
        //just get most recent for the moment, paginate later
        
        response.anims = await module.exports.getAllowedAnims(collection.anims, contactLevel);
        if(contactLevel >= PERMISSION){
            response.logins = [collection.logins[collection.logins.length - 1]];
            response.contacts = collection.contacts;
        }
        if(contactLevel === PRIVATE){
            console.debug('PRIVATE');
            console.dir(collection.notices);
            response.notices = collection.notices;
        }
        return response;
    },
    getAllowedAnims: async (anims_id, contactLevel) => {
        const sig = 'getAllowedAnims: ';
        console.debug(`${file}${sig}`);
        const anims = await module.exports.getAnimsBy_id(anims_id);
        const allowedAnims = anims.anims.filter(anim => anim.privacy <= contactLevel);
        console.dir(allowedAnims);
        return allowedAnims.reverse();
    },
    getAnimsBy_id: async (anims_id) => {
        const sig = 'getAnimsBy_id: ';
        console.debug(`${file}${sig}`);
        const db = await getDb();
        const anims = await db.collection('Anims').findOne({_id: anims_id});
        return anims;
    },
    updateCollection: async (collection, res) => {
        const sig = 'updateCollection: ';
        console.debug(`${file}${sig}`);
        if( await module.exports.isExistingCollection(collection) ){
            const update = module.exports.getUpdateCollectionBody(collection);
            try{
                console.debug("UPDATE:");
                console.dir(update);
                if(update.contacts){
                    console.debug("updateCollection: contacts");
                    module.exports.updateContacts(collection, update, res);
                }else if(update.notices){
                    console.debug("updateCollection: notices");
                    module.exports.updateNotices(update, res)
                }else if(update.deleteNotice){
                    console.debug("updateCollection: deleteNotice");
                    module.exports.deleteNotices(update, res);
                }else if(update.deleteContact){
                    console.debug("updateCollection: deleteContact");
                    module.exports.deleteContacts(update, res);
                }else if(update.username){
                    console.debug("updateCollection: username");
                    module.exports.updateUsername(collection, update, res);
                }
            }catch(error){
                console.error(error);
                res.status(500).send("Error updating this resource");
            }
        }else{
            res.status(400).send("You are trying to update a non-existant collection." 
                + "\nCall POST to create a new animation");
        }
    },
    updateContacts: async (collection, update, res) => {
        const sig = 'updateContacts: ';
        console.debug(`${file}${sig}`);
        try{
            if(await module.exports.isExistingContact(collection, update)){
                res.status(409).send("Anti-spam: contact already exists");
                return;                
            }else{
                console.debug("isExistingContactOrRequest: FALSE");
                const result = await transactions.newContact(collection, update);
                if(result){
                    res.status(200).send("OK");
                }else{
                    res.status(500).send("Not ok");
                }
            }
        }catch(error){
            console.error(error);
            res.status(500).send("Error adding contact");
        }

    },
    isExistingContact: async (collection, update) => {
        const sig = 'isExistingContact: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        let exists = 0;
        try{
            exists = await db.collection('Contacts').countDocuments(
                {userid: collection.userid, 'contacts.userid': update.contacts[0].userid })
        }catch(error){
            return error;
        }
        return exists;
    },
    isExistingNotice: async (notices) => {
        const sig = 'isExistingNotice: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        let exists = 0;
        try{
            exists = await db.collection('Notices').countDocuments(
                {userid: notices[0].userid, 'notices.reqUserid': notices[0].reqUserid});
        }catch(error){
            console.error(error);
        }
        return exists;
    },
    deleteContacts: async (update, res) => {
        const sig = 'deleteContacts: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        const contact = update.deleteContact;
        console.dir(contact);
        db.collection('Contacts').bulkWrite([
            {updateOne: {filter: {userid: contact.userid},
                update: {$pull: {contacts: {userid: contact.contacts[0].userid}}}}},
            {updateOne: {filter: {userid: contact.contacts[0].userid},
                update: {$pull: {contacts: {userid: contact.userid}}}}}
        ], (err, result) => {
            console.error(err);
            console.debug(result);
            err
            ? res.status(500).send("Error deleting contact")
            : result && result.modifiedCount
            ? res.status(201).send(result)
            : res.status(500).send("Something went wrong deleting contact")
        });
    },
    getPendingNotices: (notices) => {
        const sig = 'getPendingNotices: ';
        console.debug(`${file}${sig}`);
        let pendings = [];
        notices.forEach((notice) => {
            const pending = {
                userid: notice.reqUserid,
                username: notice.reqUsername,
                targetUserid: notice.userid,
                targetUsername: notice.username,
                type: `pending-${notice.type}`,
                message: `You sent a ${notice.type} request to ${notice.username}`,
                actions:{
                    accept: notice.requserid,
                    reject: false
                }
            }
            pendings.push(pending);
        });
        return pendings;
    },
    updateNotices: async (update, res) => {
        const sig = 'updateNotices: ';
        console.debug(`${file}${sig}`);
        const result = await transactions.newNotice(update);
        if(result){
            res.status(200).send("OK");
        }else{
            res.status(200).send("Not OK");
        }
/*        const db = mongoUtil.getDb();
        const notices = update.notices;
        //need check for duplicate
        const pendingNotices = module.exports.getPendingNotices(notices);
        try{
            if( await module.exports.isExistingNotice(notices) ){
                res.status(409).send("Anti-spam: contact request already exists");            
            }else{
                db.collection('Collection').bulkWrite([
                    {updateOne: {filter: {userid: pendingNotices[0].userid},
                        update: {$addToSet: {notices: {$each: pendingNotices}}}}},
                    {updateOne: {filter: {userid: notices[0].userid},
                        update: {$addToSet: {notices: {$each: notices}}}}}
                ], (err, result) => {
                    console.error(err);
                    err 
                    ? res.status(500).send("Error adding contact")
                    : result && result.modifiedCount
                    ? res.status(201).send(result)
                    : res.status(500).send("Something went wrong adding contact");
                });
            }
        }catch(error){console.error(error);}
    */    
   },
    deleteNotices: async (update, res) => {
        const sig = 'deleteNotices: ';
        console.debug(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        const notice = update.deleteNotice;
        let id = notice.userid;
        if(notice.type === 'pending-contact'){
            id = notice.targetUserid;
        }
        db.collection('Notices').updateOne({userid: id},
        //TODO should really have a uuid for each notice
            {$pull: {notices: {message: notice.message}}},
            (err, result) => {
                console.error(err);
                err
                ? res.status(500).send(err)
                : result && result.modifiedCount
                ? res.status(201).send(result)
                : res.status(500).send("Something went wrong deleting the notice");
            }
        );
    },
    updateUsername: async (collection, update, res) => {
        const db = await mongoUtil.getDb();
        await db.collection('Collection').updateOne({userid: collection.userid},
            {$set: {username: update.username, "anims.$[].username": update.username}}, (err, result) => {
                err 
                ? res.status(500).send("Error updating display name") 
                : result && result.modifiedCount > 0 
                ? res.status(201).send(result) 
                : res.status(500).send("Something went wrong updating display name");
               
        });
    },
    getUpdateCollectionBody: (collection) => {
        const sig = 'getUpdateCollectionBody: ';
        console.debug(`${file}${sig}`);
        let received = {};
        switch(collection.verb){
            case 'update':
                for (let [key, value] of Object.entries(collection)) {
                    console.debug(`${key}: ${value}`);
                    if(key === 'username'){
                        received.username = value;
                    }else if(key === 'contacts'){
                        received.contacts = value;
                    }else if(key === 'notices'){
                        received.notices = value;
                    }
                }
                return received;
            case 'add':
                return;
            case 'delete':
                for(let [key, value] of Object.entries(collection)){
                    console.debug(`${key}:${value}`);
                    if(key === 'contacts'){
                        received.deleteContact = collection;
                    }
                    if(key === 'notices'){
                        received.deleteNotice = collection;
                    }
                }
                if(!received.deleteContact){
                    received.deleteNotice = collection;
                }
                return received;
                default:
                    break;
        }
    }
}
