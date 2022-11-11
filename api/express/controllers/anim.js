const mongoUtil = require('../util/mongo-util');
const routeUtil = require('../util/routes-util');

const PUBLIC = 0; const PERMISSION = 1; const PRIVATE = 2;

module.exports = {
    createAnim: async (anim, res) => {
        if( await module.exports.isExistingAnim(anim) ){
            module.exports.updateAnim(anim, res)
        }else{
            module.exports.postNewAnim(anim, res);
        }
    },
    postNewAnim: async (anim, res) => {
        const db = await mongoUtil.getDb();
        const animToPost = module.exports.getAnimToPost(anim);
        console.dir(animToPost);
        db.collection('Collection').updateOne({userid: animToPost.userid},
            {$addToSet: {anims: animToPost}}).then((result, err) => {
                err 
                ? res.status(500).send("Error creating animation on database: " + err)
                : result && result.modifiedCount
                ? res.status(201).send(result)
                : res.status(500).send("Something went wrong saving animation");
            }).catch((err) => {
                res.status(500).send("Error saving animation");
                console.error(err)
            });
    },
    deleteAnim: async (req, res) => {
        console.dir(req.params);
        const animid = req.params[0];
        console.log("animid: "+animid)
        const requser = req.user ? req.user.sub.replace('auth0|', '') : 'temp';
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
        const db = await mongoUtil.getDb();
        try{
            db.collection('Collection')
                .updateOne({'anims.animid': animid},
                    {$pull: {anims: { animid: animid}}}, 
                    (err, result) => {
                        err
                        ? res.status(500).send("Error deleting the resource")
                        : result && result.modifiedCount
                        ? res.status(201).send("Resource deleted ok")
                        : res.status(500).send("Something went wrong deleting animation")
                    });
        }catch(error){
            console.error(error);
            res.status(500).send("Error deleting the resource");
        }
    },
    getAnim: async (req, res) => {
        const animid = req.params[0];
        const requser = req.user ? req.user.sub.replace('auth0|', '') : 'temp';
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
            console.log(error);
        }
    },
    getAnimById: async (animid) => {
        return new Promise((resolve, reject) => {
            mongoUtil.getDb().then((db) => {
                db.collection('Collection').findOne(
                    {'anims.animid': animid}, {'anims.$': 1}, (err, result) => {
                        if(result) resolve(result.anims.filter((a) => { return a.animid == animid})[0]);
                        if(err) reject(err);
                    }
                );
            });
        });
    },
    setGetAnimResponse: (anim, requser, res) => {
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
        const db = await mongoUtil.getDb();
        let exists = 0;
        try{
            exists = await db.collection('Collection')
                .countDocuments({'anims.animid': anim.animid});
            console.log("Anim EXISTS: " + exists);
        }catch(error){
            console.log(error);
        }
        console.log(anim.animid, "exists="+exists)
        return exists;
    },
    isValidPostReqBody: (req) => {
        console.log('reached /anim isValidPostReqBody(req)');
        console.log('REQUEST HEADERS: ' + req.headers);
        const body = req.body;
        const requser = req.user && req.user.sub ? req.user.sub.replace('auth0|', '') : '';
        console.log("REQUSER: " + requser);
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
        return req.params[0] ? (typeof req.params[0] == 'string') : false;
    },
    updateAnim: async (anim, res) => {
        console.log("updateAnim");
        const db = await mongoUtil.getDb();
        if( await module.exports.isExistingAnim(anim) ){
            try{
                await db.collection('Collection')
                    .updateOne({userid: anim.userid, 'anims.animid': anim.animid},
                        {$set: { 'anims.$': anim}},
                        (err, result) => {
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