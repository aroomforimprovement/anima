const express = require('express');
const router = express.Router();
const anim = require('../controllers/anim');
const util = require('../util/routes-util');

router.get('/*', util.jwtCheck(false), (req, res) => {
    console.log("reached /anim GET");
    if(anim.hasValidGetParam(req)){
        anim.getAnim(req, res);
    }else{
        console.error("/anim GET: responding with 500, Invalid request parameter");
        return res.status(500).send("Invalid request parameter");
    }
});

router.post('/', util.jwtCheck(true), (req, res) => {
    console.log("reached /anim POST");
    const checkedData = anim.isValidPostReqBody(req);
    if(checkedData.isValid){
        console.log("/anim POST: data is valid");
        console.dir(checkedData);
        anim.createAnim(req.body, res);
    }else{
        console.error("/anim POST: responding with "
            + checkedData.error.code + ", "
            + checkedData.error.message);
        res.status(checkedData.error.code)
            .send(checkedData.error.message);
    }
});

router.put('/', util.jwtCheck(true), (req, res) => {
    const checkedData = anim.isValidPostReqBody(req);
    if(checkedData.isValid){
        anim.updateAnim(req.body, res);
    }else{
        res.status(checkedData.error.code).send(checkedData.error.message);
    }
});

router.delete('/*', util.jwtCheck(true), (req, res) => {
    console.log("reached /anim DELETE");
    if(anim.hasValidGetParam(req)){
        anim.deleteAnim(req, res);
    }else{
        return res.status(500).send("Invalid request parameter");
    }
});

module.exports = router;