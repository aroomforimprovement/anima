const express = require('express');
const router = express.Router();
const account = require('../controllers/account');
const util = require('../util/routes-util');


router.get('/account/*', util.jwtCheck(true), (req, res) => {
    console.log("reached /account GET/");
    account.getAccountInfo(req, res);
});

module.exports = router;