const BSON = require('bson');
const { MongoError } = require('mongodb');

module.exports = {
    getLastDocumentId: async (docType, userid, db, session) => {
        const userAccountDocument = await db.collection('Collection')
            .findOne({ userid: userid }, { session });
        const type = docType.toLowerCase();
        let lastDocId = userAccountDocument[type];
        let document = await db.collection(docType)
            .findOne({ _id: lastDocId }, { session });
        console.log(`getLastDocumentId: documentId: ${document._id}`);
        let hasMore = true;
        while(hasMore){
            const more = document.next;
            if(more){
                lastDocId = more;
                document = await db.collection(docType)
                    .findOne({ _id: lastDocId }, { session });
            }else{
                hasMore = false;
            }
        }
        const size = BSON.calculateObjectSize(document);

        if(size > 12*1024){
            const newDocResult = await db.collection(docType).insertOne(
                { userid: userid, [docType]: [] }, { session }
            );
            if(newDocResult.insertedId){
                await db.collection(docType).updateOne(
                    { _id: lastDocId },
                    { next: newDocResult.insertedId },
                    { session }
                );
            }
        }else{
            return lastDocId;
        }
    },
    handleTransactionError: (data, retry, error) => {
        console.error(error);
        if(error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')){
            return {ok: 0};
        }else if(error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')){
            retry(data);
        }
    }
}