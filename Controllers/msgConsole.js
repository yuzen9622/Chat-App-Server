const msgModel = require("../Database/msgData");
const sharp = require("sharp");
const createMsg = async (req, res) => {
  try {
    const { chatId, senderId, text, isRead, repeatmsg, type } = req.body;
    let imgBuffer;
    let width;
    let height;
    if (type == "img") {
      const { img } = req.files;

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!img || !chatId) return res.status(200).json("無照片或Id");
      if (!allowedTypes.find((type) => type == img.mimetype))
        return res.status(200).json("照片格式不對");
      imgBuffer = await sharp(img.data).toBuffer();
      await sharp(img.data)
        .metadata()
        .then((metadata) => {
          width = metadata.width;
          height = metadata.height;
        });
      console.log(width, height);
    }

    const message =
      type == "text"
        ? new msgModel({
            chatId,
            senderId,
            text,
            isRead,
            repeatMsg: repeatmsg,
          })
        : new msgModel({
            chatId,
            senderId,
            isRead,
            repeatMsg: repeatmsg,
            img: imgBuffer,
            aspectRatio: width / height,
            text,
          });
    const response = await message.save();
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const getMsg = async (req, res) => {
  const { chatId, limit } = req.params;
  try {
    let messages = await msgModel
      .find({ chatId }, { img: 0 })
      .sort({ createdAt: -1 })
      .limit(limit);
    let messagesCount = await msgModel.find({ chatId }).countDocuments();
    console.log(messagesCount);
    messages.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    res.status(200).json({ messages, messagesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const readMsg = async (req, res) => {
  const { chatId, senderId } = req.params;

  try {
    await msgModel.updateMany(
      { chatId: chatId, senderId: senderId },
      { $set: { isRead: true } }
    );
    const messages = await msgModel.find({ chatId });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
const getMsgImg = async (req, res) => {
  try {
    const msgId = req.params.msgId;
    const msg = await msgModel.findById({
      _id: msgId,
    });
    if (msg && msg.img) {
      res.set("Content-Type", "image/png");
      res.send(msg.img);
    } else {
      res.send("not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json("not found");
  }
};
module.exports = { createMsg, getMsg, readMsg, getMsgImg };
