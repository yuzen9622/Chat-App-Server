const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String,
    isRead: Boolean
}, {
    timestamps: true
})
const msgModel = mongoose.model("Msg", msgSchema)
module.exports = msgModel;