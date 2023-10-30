const { getDb, getClient, transactionOptions } = require("../util/mongo-util");
const BSON = require('bson');
const file = 'transactions/messages: ';

module.exports = {
    newMessage: async (convid, message, record, res) => {
        const sig = `${file}newMessage: `;
        console.debug(sig);
        const db = await getDb();
        const client = await getClient();

        const session = client.startSession();

        try{
            session.startTransaction(transactionOptions);

            try{
                const messageResult = await db.collection('Messages').insertOne(
                    message, {session}
                );
                const messageId = messageResult.insertedId;
                if(messageId){
                    record.messid = messageId;
                    const convId = await module.exports.getLastDocumentId('Conversations', convid, db, session);
                    const conversationId = convId.toString();
                    console.debug(`${sig}convId: ${conversationId}`)
                    const idType = conversationId.indexOf('=') > -1 ? 'convid' : '_id';
                    const convResult = await db.collection('Conversations').updateOne(
                        {[idType]: conversationId}, {
                            $addToSet: {messages: record}
                        }
                    );
                    console.dir(convResult);
                    if(convResult.modifiedCount){
                        await session.commitTransaction();
                        res.status(200).send("Message sent ok");
                    }else{
                        res.status(500).send("Problem sending message");
                    }
                }else{
                    res.status(500).send("Problem sending message");
                }
            }catch(error){
                console.error(error.message);
                res.status(500).send("Problem sending message");
            }
        }catch(error){
            console.error(error.message);
            res.status(500).send("Problem sending message");
        }
    },
    getLastDocumentId: async (docType, convid, db, session) => {
        const sig = `${file}getLastDocumentId: `;
        console.debug(sig);
        let lastDocId = convid;
        let document = await db.collection(docType).findOne({ convid: convid}, {session});
        let hasMore = true;
        while(hasMore){
            const more = document.next;
            if(more){
                lastDocId = more;
                document = await db.collection(docType).findOne({_id: lastDocId}, {session});
            }else{
                hasMore = false;
            }
        }
        console.debug(`${sig}lastDocId before size check: ${lastDocId}`);
        const size = BSON.calculateObjectSize(document);
        console.debug(`${sig}${size}`);
        if(size > 12*1024){
            console.debug(`${sig}document too large`)
            const newDocResult = await db.collection(docType).insertOne({
                convid: convid,
                messages: [] 
            });
            if(newDocResult.insertedId){
                console.debug(`${sig}created new document: ${newDocResult.insertedId}`);
                const idType = lastDocId.indexOf('=') > -1 ? 'convid' : '_id';
                console.log(`${sig}idType: ${idType}`);
                await db.collection(docType).updateOne(
                    {[idType]: lastDocId},
                    { "$set": {next: newDocResult.insertedId} },
                    {session}
                );
                return newDocResult.insertedId
            }
        }else{
            return lastDocId;
        }
    }
}