const express = require('express');
const router = express.Router();
const coll = require('../controllers/collection');
const util = require('../util/routes-util');

router.get('/', util.jwtCheck(false), (req, res) => {
    console.log("reached /collection GET/");
    coll.getCollection(req, res);
});

router.get('/*', util.jwtCheck(false), (req, res) => {
    console.log("reached /collection GET/id");
    if(coll.hasValidGetParam(req)){
        coll.getCollectionById(req, res);
    }else{
        return res.status(500).send("Invalid request parameter");
    }
});

router.post('/', util.jwtCheck(true), (req, res) => {
    console.log("reached /collection POST/");
    const checkedData = coll.isValidPostReqBody(req);
    if(checkedData.isValid){
        console.log("/collection POST: data is valid");
        coll.createCollection(req.body, res);
    }else{
        console.error("/collection POST: responding with "
            + checkedData.error.code + ","
            + checkedData.error.message);
        res.statusMessage(checkedData.error.code)
            .send(checkedData.error.message);
    }
});

router.put('/', util.jwtCheck(true), (req, res) => {
    console.log("reached /collection PUT/");
    const checkedData = coll.isValidPostReqBody(req);
    if(checkedData.isValid){
        coll.updateCollection(req.body, res);
    }else{
        res.status(checkedData.error.code)
            .send(checkedData.error.message);
    }
});

router.delete('/*', util.jwtCheck(true), (req, res) => {
    console.log("reached /collection DELETE/");
    if(coll.hasValidGetParam(req)){
        coll.deleteCollection(req, res);
    }else{
        return res.status(500).send("Invalid request parameter");
    }
});

module.exports = router;