const express = require('express');
const router = express.Router();
const index = require('../controllers/index');
const util = require('../util/routes-util');


router.get('/signup/delete/test', () => {
    index.cleanTestSignup();
});

router.post('/login', util.jwtCheck(true), (req, res) => {
    console.log("reached /login");
    const data = req.body;
    const checkedData = index.isValidLoginReqBody(data);
    if(checkedData.isValid){
        index.addLogin(checkedData, res)
    }else{
        res.status(403).send("Invalid sign in attempt");
    }
});


router.post('/logout', util.jwtCheck(false), (req, res) => {
    const data = req.body;
    const checkedData = index.isValidLogoutReqBody(data);
    if(checkedData.isValid){
        index.addLogout(checkedData, res);
    }else{
        res.status(403).send("Invalid sign in attempt");
    }
});

router.post('/signup', util.jwtCheck(true), (req, res) => {
    const data = req.body;
    const checkedData = index.isValidSignupReqBody(data);
    if(checkedData.isValid){
        index.addLogin(checkedData, res);
    }else{
        res.status(403).send("Invalid sign in attempt");
    }
});

const account = require('../controllers/account');
//no idea why this wouldn't work from own file :(
router.get('/account/*', util.jwtCheck(true), (req, res) => {
    console.log("reached /account GET/");
    account.getAccountInfo(req, res);
});


router.post('/verify', util.jwtCheck(true), (req, res) => {
    console.log("reached /verify");
    index.resendVerification(req, res);
})

router.get('/', util.jwtCheck(true), (req, res) => {
    index.getIndex(req, res);
});



module.exports = router;