const { getClient, getDb, transactionOptions } = require('../util/mongo-util');
const { getLastDocumentId, handleTransactionError } = require('../util/transaction-util');

module.exports = {
    newAnim: async (animToPost) => {
        const db = await getDb();
        const client = await getClient();
        const session = client.startSession();

        try{
            session.startTransaction(transactionOptions);
            try{
                const animId = await getLastDocumentId('Anims', animToPost.userid, db, session);

                const animResult = await db.collection('Anims').updateOne(
                    {_id: animId}, {$addToSet: {anims: animToPost}}, {session}
                );
                console.dir(animResult);
                if(animResult.modifiedCount){
                    await session.commitTransaction();
                    return animResult.result;
                }
            }catch(error){
                console.error(error);
                handleTransactionError(animToPost, module.exports.newAnim, error);
                await session.abortTransaction();
                return error;
            }finally{
                await session.endSession();
            }
        }catch(error){
            console.error(error);
            await session.abortTransaction();
            return error;
        }finally{
            await session.endSession();
        }
    }
}