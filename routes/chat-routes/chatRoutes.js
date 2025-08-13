const express = require("express");
const router = express.Router();
const { existingChat, chatFetching } = require('../../controllers/chat-controller/chats-controller');

router.post('/', existingChat);
router.get('/:userId', chatFetching);

module.exports = router;
