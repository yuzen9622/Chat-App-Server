const express = require("express");
const { getMsg, createMsg, readMsg } = require("../Controllers/msgConsole");

const router = express.Router();
router.post("/", createMsg);
router.get("/:chatId", getMsg)
router.get("/read/:chatId/:senderId", readMsg)
module.exports = router