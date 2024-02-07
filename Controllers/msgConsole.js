const msgModel = require("../Database/msgData");

const createMsg = async (req, res) => {
    const { chatId, senderId, text, isRead } = req.body;
    const message = new msgModel({
        chatId, senderId, text, isRead
    })
    try {
        const response = await message.save()
        res.status(200).json(response)
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}

const getMsg = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await msgModel.find({ chatId })
        res.status(200).json(messages)

    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}

const readMsg = async (req, res) => {
    const { chatId, senderId } = req.params;

    try {

        const updateMsg = await msgModel.updateMany(
            { chatId: chatId, senderId: senderId }, { $set: { isRead: true } })
        const messages = await msgModel.find({ chatId })

        res.status(200).json(messages)

    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
}
module.exports = { createMsg, getMsg, readMsg }