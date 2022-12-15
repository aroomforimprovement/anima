const { getDb } = require("../util/mongo-util");
const file = 'controllers/messages.js: ';

module.exports = {
    getConversation: async (id, res) => {
        const sig = `${file}getConversation: `;
        console.debug(sig);
        if(await module.exports.isExistingConversation(id)){
            module.exports.getExistingConversation(id, res);
        }else{
            module.exports.createConversation(id, res);
        }
    },
    getExistingConversation: async (id, res) => {
        const db = await getDb();
        try{
            const result = db.collection('Conversations').findOne({convid: id});
            if(result){
                res.status(200).send(result);
            }else{
                res.status(500).send(result);
            }
        }catch(error){
            console.error(error);
            res.status(500).send(error);
        }
    },
    createConversation: async (id, res) => {
        const sig = `${file}createConversation: `;
        console.debug(sig);
        const db = await getDb();
        const conversation = {
            convid: id,
            messages: []
        }
        try{
            const result = await db.collection('Conversations').insertOne(conversation);
            if(result && result.insertedId){
                res.status(201).send(conversation);
            }else{
                res.status(500).send("Error creating conversation");
            }

        }catch(error){
            console.error(error);
            res.status(200).send(error);
        }
    },
    isExistingConversation: async (id) => {
        const sig = `${file}isExistingConversation`;
        let count;
        const db = await getDb();
        try{
            count = await db.collection('Conversations').countDocuments({convid: id});
        }catch(error){
            console.error(error);
        }
        console.debug(`${sig}count: ${count}`);
        if(count == 0){
            return false;
        }else{
            return true;
        }
    }
}