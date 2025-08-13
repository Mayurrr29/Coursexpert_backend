const express = require("express");
const router = express.Router();
const{sendNewMessage,getMessages}=require("../../controllers/chat-controller/message-controller");

router.post('/', sendNewMessage);
router.get('/:chatId', getMessages);
module.exports = router;