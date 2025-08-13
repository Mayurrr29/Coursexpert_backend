const Message = require("../../models/Message");

const sendNewMessage = async (req, res) => {
     try {
    const { chatId, senderId, text } = req.body;
    const message = await Message.create({ chatId, senderId, text });
  
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMessages = async (req, res) => {
     try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
    sendNewMessage,
    getMessages
};