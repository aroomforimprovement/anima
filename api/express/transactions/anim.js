const { getClient, getDb, transactionOptions } = require('../util/mongo-util');
const { getLastDocumentId, handleTransactionError } = require('../util/transaction-util');
const file = 'transactions/anim.js: ';

module.exports = {
    newAnim: async (animToPost, res) => {
        const sig = 'newAnim: ';
        console.debug(`${file}${sig}`);
        const db = await getDb();
        const client = await getClient();
        const session = client.startSession();
        let commit = {ok: false};
        try{
            session.startTransaction(transactionOptions);
            try{
                const animsId = await getLastDocumentId('Anims', animToPost.userid, db, session);
                console.debug(`${file}${sig}animsId: ${animsId}`);
                const animResult = await db.collection('Anims').updateOne(
                    {_id: animsId}, {$addToSet: {anims: animToPost}}, {session}
                );
                console.dir(animResult);
                if(animResult.modifiedCount){
                    commit = await session.commitTransaction();
                }else{
                    commit = {ok: false};
                }
            }catch(error){
                console.error(error.message);
                handleTransactionError(animToPost, module.exports.newAnim, error);
                await session.abortTransaction();
                commit = {ok: false};
            }finally{
                await session.endSession();
            }
        }catch(error){
            console.error(error);
            await session.abortTransaction();
            commit = {ok: false};
        }finally{
            await session.endSession();
        }

        if(commit.ok){
            res.status(201).send("Anim saved ok");
        }else{
            res.status(500).send("Error saving Anim");
        }
    }
}