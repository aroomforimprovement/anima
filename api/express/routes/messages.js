const express = require('express');
const router = express.Router();
const messages = require('../controllers/messages');
const util = require('../util/routes-util');

router.get('/*', util.jwtCheck(true), (req, res) => {
    console.debug(`reached GET /messages/${req.params[0]}`)
    //TODO check ownership, check is contact
    messages.getConversation(req.params[0], res);
});

router.post('/', util.jwtCheck(true), (req, res) => {
    console.debug(`reached POST /messages, convid: ${req.body.convid}`);
    messages.addMessage(req, res);
});

module.exports = router;