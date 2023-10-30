const { getClient, getDb, transactionOptions } = require('../util/mongo-util');
const { MongoError } = require('mongodb');
const BSON = require('bson');
const file = 'transactions/collection.js: ';

module.exports = {
    deleteCollection: async (id) => {
        const sig = 'deleteCollection: ';
        console.debug(`${file}${sig}`);
        const client = await getClient();
        const db = await getDb();

        const session = client.startSession();

        try{
            session.startTransaction(transactionOptions);

            const accountResult = await db.collection('Collection')
                .deleteOne({userid: id});
            console.dir(accountResult);

            let otherContactsResult = true;
            const userContacts = await db.collection('Contacts')
                .findOne({userid: id});
            await userContacts.contacts.forEach(async (contact) => {
                await db.collection('Contacts').bulkWrite([
                    {updateOne: {filter: {userid: contact.userid},
                        update: {$pull: {contacts: {userid: id}}}}}
                ], (err, res) => {
                    console.error(err);
                    console.debug(res);
                    if(err){
                        otherContactsResult = false;
                    }
                })
            })
            console.debug(otherContactsResult);

            const userContactsResult = await db.collection('Contacts')
                .deleteMany({userid: id});
            console.dir(userContactsResult);

            let otherNoticesResult = true;
            const userNotices = await db.collection('Notices')
                .findOne({userid: id});
            await userNotices.notices.forEach(async (notice) => {
                const contactId = notice.type === 'pending-contact'
                    ? notice.targetUserid : notice.reqUserid;
                
                await db.collection('Notices').bulkWrite([
                    {updateOne: {filter: {userid: contactId},
                        update: {$pull: {notices: {
                            ...notice.type === 'pending-contact' 
                                && {targetUserid: id}, 
                            ...notice.type != 'pending-contact' 
                                && {reqUserid: id}
                        }}}}
                    }
                ], (err, res) => {
                    console.error(err);
                    console.debug(res);
                    if(err){
                        otherNoticesResult = false;
                    }
                })
            })
            console.debug(otherNoticesResult);

            const userNoticesResult = await db.collection('Notices')
                .deleteMany({userid: id});
            console.dir(userNoticesResult);

            const animsResult = await db.collection('Anims')
                .deleteMany({userid: id});
            console.dir(animsResult);

            const commit = await session.commitTransaction();
            return commit;
        }catch(error){
            console.error(error);
            if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
                return {ok: 0};
            }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
                module.exports.deleteCollection(id);
            }
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
    },
    newCollection: async (colObj) => {
        const sig = 'newCollection: ';
        console.debug(`${file}${sig}`);
        //console.dir(colObj);
        const client = await getClient();
        const db = await getDb();
        
        const session = client.startSession();
        
        try{
            session.startTransaction(transactionOptions);            
            
            const contactsResult = await db.collection('Contacts')
                .insertOne(colObj.contacts, { session });
            colObj.contacts = contactsResult.insertedId;

            const noticesResult = await db.collection('Notices')
                .insertOne(colObj.notices, { session });
            colObj.notices = noticesResult.insertedId;

            //const animsResult = await db.collection('Anims')
            //    .insertOne(colObj.anims, { session });
            //colObj.anims = animsResult.insertedId;

            await db.collection('Collection')
                .insertOne(colObj, { session });
            const commit = await session.commitTransaction();
            
            return commit;

        }catch(error){
            console.error(error);
            if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
                return {ok: 0};
            }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
                module.exports.newCollection(colObj);
            }
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
    },
    newContact: async (collection, update) => {
        const sig = 'newContact: ';
        console.debug(`${file}${sig}`);
        const db = await getDb();
        const client = await getClient();

        const userId = collection.userid;
        const otherUserId = update.contacts[0].userid;
        const otherContacts = [{userid: collection.userid, username: collection.thisUsername}];

        const session = client.startSession();

        try{
            session.startTransaction(transactionOptions);

            try{

                const contactsId = await module.exports.getLastDocumentId('Contacts', userId, db, session);
                const otherContactsId = await module.exports.getLastDocumentId('Contacts', otherUserId, db, session);

                const contactsResult = await db.collection('Contacts').bulkWrite([
                    {updateOne: {filter: {_id: contactsId}, 
                        update: {$addToSet: {contacts: {$each: update.contacts}}}}},
                    {updateOne: {filter: {_id: otherContactsId},
                        update: {$addToSet: {contacts: {$each: otherContacts}}}}}
                ],  { session });
                
                if(contactsResult.result.ok){
                    await session.commitTransaction();
                    return contactsResult.result;
                }
                
            }catch(error){
                console.error(error);
                if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
                    return {ok: 0};
                }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
                    module.exports.newContact(collection, update);
                }
                await session.abortTransaction();
            }finally{
                await session.endSession();
            }

        }catch(error){
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
    },
    newNotice: async (update) => {
        const sig = 'newNotice: ';
        console.debug(`${file}${sig}`);
        const db = await getDb();
        const client = await getClient();
        const notices = update.notices;
        const pendingNotices = module.exports.getPendingNotices(notices);
        const session = client.startSession();
        try{
            session.startTransaction(transactionOptions);
            try{
                const noticesId = await module.exports
                    .getLastDocumentId('Notices', notices[0].userid,db, session);
                const otherNoticesId = await module.exports   
                    .getLastDocumentId('Notices', pendingNotices[0].userid, db, session);

                const noticesResult = await db.collection('Notices').bulkWrite([
                    {updateOne: {filter: {_id: noticesId},
                        update: {$addToSet: {notices: {$each: update.notices}}}}},
                    {updateOne: {filter: {_id: otherNoticesId},
                        update: {$addToSet: {notices: {$each: pendingNotices}}}}}
                ], { session });
                console.dir(noticesResult);
                if(noticesResult.result.ok){
                    await session.commitTransaction();
                    return noticesResult.result;
                }
            }catch(error){
                console.error(error);
                if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
                    return {ok: 0};
                }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
                    module.exports.newNotice(update);
                }
                await session.abortTransaction();
            }finally{
                await session.endSession();
            }
        }catch(error){
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
    },
    getLastDocumentId: async (docType, userid, db, session) => {
        const sig = 'getLastDocumentId: ';
        console.debug(`${file}${sig}`);
        const userCollectionDocument = await db.collection('Collection').findOne(
            { userid: userid }, { session }
        );
        const type = docType.toLowerCase();
        let lastDocId = userCollectionDocument[type];
        let document = await db.collection(docType).findOne(
            { _id: lastDocId }, { session }
        )
        console.debug(`getLastDocumentId: documentId: ${document._id}`);
        let hasMore = true;
        while(hasMore){
            const more = document.next;
            if(more){
                lastDocId = more;
                document = await db.collection(docType).findOne(
                    {_id: lastDocId }, { session }
                )
            }else{
                hasMore = false;
            }
        }
        //TODO this doesn't really work
        const size = BSON.calculateObjectSize(document);
                
        if(size > 12*1024){
            const newDocResult = await db.collection(docType).insertOne(
                { userid: userid, [type]: [] }, { session }
            );
            if(newDocResult.insertedId){
                await db.collection(docType).updateOne(
                    { _id: lastDocId },
                    { next: newDocResult.insertedId },
                    { session }
                );
                return newDocResult.insertedId;
            }
        }else{
            return lastDocId;
        }
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
    getAccount: async (id) => {
        const sig = 'getAccount: ';
        console.debug(`${file}${sig}`);
        const client = await getClient();
        const db = await getDb();

        const session = client.startSession();

        try{
            session.startTransaction(transactionOptions);

            try{
                const accountResult = await db.collection('Collection')
                    .findOne({userid: id}, { session });

                const notices = [];
                const noticesCursor = db.collection('Notices')
                    .find({userid: id}, { session });
                await noticesCursor.forEach((doc) => {
                    doc.notices.forEach((notice) => {
                        notices.push(notice);
                    });
                });
                accountResult.notices = notices;
                console.debug("accountResult.notices");
                console.dir(accountResult.notices);
                const contacts = [];
                const contactsCursor = db.collection('Contacts')
                    .find({userid: id}, { session });
                await contactsCursor.forEach((doc) => {
                    doc.contacts.forEach((contact) => {
                        contacts.push(contact);
                    });
                });
                accountResult.contacts = contacts;

                return {ok: 1, account: accountResult};
            }catch(error){
                console.error(error);
                if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
                    return {ok: 0};
                }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
                    module.exports.getAccount(id);
                }
                await session.abortTransaction();
            }finally{
                await session.endSession();
            }
        }catch(error){
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
    }
}