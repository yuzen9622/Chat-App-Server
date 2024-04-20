const express = require("express");
const { createChat, findUserChats, findChats, delChat } = require("../Controllers/chatConsle");

const router = express.Router();

router.post("/", createChat)
router.get("/:userId", findUserChats)
router.get("/find/:firstId/:secondId", findChats);
router.get("/delete/:userId/:secondId", delChat);
module.exports = router;