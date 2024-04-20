const express = require("express");
const {
  getMsg,
  createMsg,
  readMsg,
  getMsgImg,
} = require("../Controllers/msgConsole");

const router = express.Router();
router.post("/", createMsg);
router.get("/:chatId/:limit", getMsg);
router.get("/read/:chatId/:senderId", readMsg);
router.get("/:msgId", getMsgImg);
module.exports = router;
