const Chat = require('../../models/Chat');



const existingChat = async (req, res) => {
 try {
    const { userId, instructorId } = req.body;
    let chat = await Chat.findOne({ members: { $all: [userId, instructorId] } });
    if (!chat) {
      chat = await Chat.create({ members: [userId, instructorId] });
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


const chatFetching = async (req, res) => {
     try {
    const chats = await Chat.find({ members: req.params.userId });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports = {
   existingChat,
    chatFetching
};