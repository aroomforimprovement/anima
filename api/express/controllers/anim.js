const { newAnim } = require('../transactions/anim');
const mongoUtil = require('../util/mongo-util');
const routeUtil = require('../util/routes-util');

const PUBLIC = 0; const PERMISSION = 1; const PRIVATE = 2;
const file = 'controllers/anim.js: ';

module.exports = {
    createAnim: async (anim, res) => {
        const sig = 'createAnim: ';
        console.debug(`${file}${sig}`);
        if( await module.exports.isExistingAnim(anim) ){
            module.exports.updateAnim(anim, res)
        }else{
            module.exports.postNewAnim(anim, res);
        }
    },
    postNewAnim: async (anim, res) => {
        const sig = 'postNewAnim: ';
        console.debug(`${file}${sig}`);
        const animToPost = module.exports.getAnimToPost(anim);
        console.dir(animToPost);
        newAnim(animToPost, res);
    },
    deleteAnim: async (req, res) => {
        const sig = 'deleteAnim: ';
        console.log(`${file}${sig}`);
        console.dir(req.params);
        const animid = req.params[0];
        console.debug("animid: "+animid)
        const requser = req.user ? req.user.sub.replace(/.+\|/gm, '') : 'temp';
        if(await module.exports.isExistingAnim({animid: animid})){
            module.exports.isRequesterOwner(requser, animid).then((resolve, reject) => {
                if(reject){
                    res.status(403).send("Current user doesn't have permission to delete this anim");
                }
                if(resolve){
                    module.exports.deleteAnimById(animid, res);
                }
            }).catch((error) => {console.error(error)});
        }else{
            res.status(404).send("The anim doesn't exist");
        }
    },
    isRequesterOwner: async (requser, animid) => {
        const sig = 'isRequesterOwner: ';
        console.log(`${file}${sig}`);
        return new Promise((resolve, reject) => {
            module.exports.getAnimById(animid).then((res, rej) => {
                if(res && requser === res.userid){
                    resolve(res);
                }else{
                    reject(rej);
                }
            })
        });
    },
    deleteAnimById: async (animid, res) => {
        const sig = 'deleteAnimById: ';
        console.log(`${file}${sig}`);
        const db = await mongoUtil.getDb();
        try{
            db.collection('Anims')
                .deleteOne({animid: animid},
                    (err, result) => {
                        console.dir(result);
                        err
                        ? res.status(500).send("Error deleting the resource")
                        : result && result.deletedCount
                        ? res.status(201).send("Resource deleted ok")
                        : res.status(500).send("Something went wrong deleting animation")
                    });
        }catch(error){
            console.error(error);
            res.status(500).send("Error deleting the resource");
        }
    },
    getAnim: async (req, res) => {
        const sig = 'getAnim: ';
        console.log(`${file}${sig}`);
        const animid = req.params[0];
        const requser = req.user ? req.user.sub.replace(/.+\|/gm, '') : 'temp';
        try{
            await module.exports.getAnimById(animid).then((resolve, reject) => {
            if(reject){
                res.status(500).send("Error retrieving anim");
            }
            if(resolve){
                module.exports.setGetAnimResponse(resolve, requser, res);
            }
        });
        }catch(error){
            console.debug(error);
        }
    },
    getAnimById: async (animid) => {
        const sig = 'getAnimById: ';
        console.log(`${file}${sig}`);
        return new Promise((resolve, reject) => {
            mongoUtil.getDb().then((db) => {
                db.collection('Anims').findOne(
                    {animid: animid}, (err, result) => {
                        if(result) resolve(result)
                        if(err) reject(err);
                    }
                );
            });
        });
    },
    setGetAnimResponse: (anim, requser, res) => {
        const sig = 'setGetAnimResponse: ';
        console.log(`${file}${sig}`);
        if(anim){
            if(anim.privacy === PUBLIC){
                res.status(200).send(anim);
            }else if(anim.privacy === PRIVATE){
                routeUtil.respondWithPermission(
                    anim.userid === requser, res, anim);
            }else if(anim.privacy === PERMISSION){
                routeUtil.respondWithPermission(
                    routeUtil.hasContact(requser, anim.userid), res, anim);
            }else{
                res.status(500).send("The privacy setting of this resource could not be determined");
                }
        }else{
            res.status('404').send("Couldn't find that animation");
        }
    },
    getAnimToPost: (anim) => {
        const sig = 'getAnimToPost: ';
        console.log(`${file}${sig}`);
        return {
            animid: anim.animid,
            userid: anim.userid,
            username: anim.username,
            name: anim.name ? anim.name : anim.animid,
            type: anim.type ? anim.type : 'animation',
            created: anim.created ? anim.created : new Date(),
            modified: anim.modified ? anim.modified : new Date(),
            frate: anim.frate ? anim.frate : 8,
            size: anim.size ? anim.size : 640,
            privacy: anim.privacy ? anim.privacy : 0,
            frames: anim.frames ? anim.frames : [],
            lastFrame: anim.lastFrame ? anim.lastFrame : [],
            layers: anim.layers ? anim.layers : []
        }
    },
    isExistingAnim: async (anim) => {
        const sig = `${file}isExistingAnim: `;
        console.debug(`${sig}`);
        const db = await mongoUtil.getDb();
        let exists = 0;
        try{
            exists = await db.collection('Anims')
                .countDocuments({animid: anim.animid});
            console.debug("Anim EXISTS: " + exists);
        }catch(error){
            console.debug(error);
        }
        console.debug(anim.animid, "exists="+exists)
        return exists;
    },
    isValidPostReqBody: (req) => {
        const sig = 'isValidPostReqBody: ';
        console.debug(`${file}${sig}`);
        console.debug('REQUEST HEADERS: ' + req.headers);
        const body = req.body;
        const requser = req.user && req.user.sub ? req.user.sub.replace(/.+\|/gm, '') : '';
        console.debug("REQUSER: " + requser);
        if(body.animid && typeof body.animid == 'string' 
            && body.userid && typeof body.userid == 'string' 
            && body.userid === requser){
                return {
                    isValid: true, 
                    userid: body.userid, 
                    animid: body.animid
                }
            }else if(body.animid && body.userid && body.userid !== requser){
                return {isValid: false, error: {code: 403, message: "User must be authenticated to use update animations"}};                                
            }else{
                console.error(body);
                return {isValid: false, error: {code: 400, message: "Bad request, animation lacking required ids"}};
            }
    },
    hasValidGetParam: (req) => {
        const sig = 'hasValidGetParams: ';
        console.debug(`${file}${sig}`);
        return req.params[0] ? (typeof req.params[0] == 'string') : false;
    },
    updateAnim: async (anim, res) => {
        const sig = 'updateAnim: ';
        console.debug(`${file}${sig}`);
        console.dir(anim);
        const db = await mongoUtil.getDb();
        if( await module.exports.isExistingAnim(anim) ){
            try{
                await db.collection('Anims').replaceOne(
                    {animid: {$eq: anim.animid}},
                    {
                        animid: anim.animid,
                        userid: anim.userid,
                        username: anim.username,
                        name: anim.name,
                        type: anim.type,
                        created: anim.created,
                        modified: Date.now(),
                        frate: anim.frate,
                        size: anim.size,
                        privacy: anim.privacy,
                        frames: anim.frames,
                        lastFrame: anim.lastFrame,
                        layers: anim.layers
                    },
                    (err, result) => {
                        console.dir(result);
                        err
                        ? res.status(500).send("Error updating the resource: " + err)
                        : result && result.modifiedCount
                        ? res.status(201).send(result)
                        : res.status(500).send("Something went wrong updating the resource")
                        });
            }catch(error){
                console.error(error);
                res.status(500).send("Error updating the resource: " + error);
            }
        }else{
            res.status(400).send("You are trying to update an non-existant animation." 
                +" Call POST to create a new animation");
        }
    }
}