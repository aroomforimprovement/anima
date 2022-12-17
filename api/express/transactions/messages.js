const { getDb, getClient, transactionOptions } = require("../util/mongo-util");

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
                    //update conversation
                    const convResult = await db.collection('Conversations').updateOne(
                        {convid: convid}, {
                            $addToSet: {messages: messageId}
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
                console.error(error);
                res.status(500).send("Problem sending message");
            }
        }catch(error){
            console.error(error);
            res.status(500).send("Problem sending message");
        }
    }
}