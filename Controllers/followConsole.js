const followModel = require("../Database/followData");
const chatModel = require("../Database/chatData");
const msgModel = require("../Database/chatData");

const createFriend = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const newFriend = new followModel({
      members: [firstId, secondId],
    });
    const response = await newFriend.save();
    res.status(200).json(response);
  } catch (error) {}
};
const deleteFriend = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    await followModel.findOneAndDelete({
      members: { $all: [firstId, secondId] },
    });
    const delchat = await chatModel.findOneAndDelete({
      members: { $all: [firstId, secondId] },
    });
    if (delchat) {
      const chatId = delchat._id;
      await msgModel.deleteMany({ chatId: chatId });
    }

    const friend = await followModel.find({
      members: { $all: [firstId] },
    });

    res.status(200).json(friend);
  } catch (err) {
    res.status(200).json(err);
  }
};

const findFriend = async (req, res) => {
  const { userId } = req.params;
  const friend = await followModel.find({
    members: { $all: [userId] },
  });
  res.status(200).json(friend);
};

module.exports = { createFriend, deleteFriend, findFriend };
