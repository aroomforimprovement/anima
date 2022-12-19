const ObjectId = require('mongodb').ObjectId;
const { newMessage } = require("../transactions/messages");
const { getDb } = require("../util/mongo-util");
const file = 'controllers/messages.js: ';

module.exports = {
    addMessage: async (req, res) => {
        const sig = `${file}addMessage: `;
        console.debug(sig);
        const convid = await module.exports.isExistingConversation(req.body.convid);
        console.debug(`${sig}convid: ${convid}`);
        const time = Date.now();
        const message = {
            anim: req.body.anim,
            convid: req.body.convid,
            time: time
        }
        const record = {
            userid: req.body.anim.userid,
            username: req.body.anim.username,
            anim: req.body.anim.name,
            time: time
        }
        newMessage(convid, message, record, res);
    },
    getMessage: async (id, res) => {
        const sig = `${file}getMessage: `;
        console.debug(`${sig}${id}`);
        const db = await getDb();

        
        const result = await db.collection('Messages').findOne({_id: new ObjectId(id)});
        console.dir(result);
        if(result){
            res.status(200).send(result);
        }else{
            res.status(500).send(result);
        }
    },
    getConversation: async (id, res) => {
        const sig = `${file}getConversation: `;
        console.debug(sig);
        const realId = await module.exports.isExistingConversation(id);
        if(realId){
            module.exports.getExistingConversation(realId, res);
        }else{
            module.exports.createConversation(id, res);
        }
    },
    getExistingConversation: async (id, res) => {
        const sig = `${file}getExistingConversation: `;
        console.debug(sig);
        const db = await getDb();
        
        try{
            const result = await db.collection('Conversations').findOne({convid: id});
            console.debug(`${sig}findOne: convid: ${id}`);
            console.dir(result);
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
        const sig = `${file}isExistingConversation: `;
        console.debug(`${sig}${id}`);
        let count;
        const convid1 = id;
        const ids = convid1.split('=');
        const convid2 = `${ids[1]}=${ids[0]}`;
        console.debug(`${sig}convid1: ${convid1}`);
        console.debug(`${sig}convid2: ${convid2}`);
        const db = await getDb();
        try{
            count = await db.collection('Conversations').countDocuments({convid: convid1});
            console.debug(`${sig}count1: ${count}`);
            if(count == 0){
                count = await db.collection('Conversations').countDocuments({convid: convid2});
                console.debug(`${sig}count2: ${count}`);
                if(count == 0){
                    return false;
                }else{
                    return convid2;
                }
            }else{
                return convid1;
            }
        }catch(error){
            console.error(error);
        }
    }
}