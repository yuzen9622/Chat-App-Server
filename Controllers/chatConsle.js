const chatModel = require("../Database/chatData");

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {

        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })

        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        })
        const response = await newChat.save()

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}
const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        })
        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}

const findChats = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.find({
            members: { $all: [firstId, secondId] }
        })
        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}
const delChat = async (req, res) => {
    const { userId, secondId } = req.params;
    try {

    } catch (err) {

    }
}
module.exports = { createChat, findUserChats, findChats }