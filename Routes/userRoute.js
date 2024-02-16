const express = require("express");
const { registerUser, loginUser, findUser, getUser, findUserByName, uploadAvarter, getAvatar, updateUser } = require("../Controllers/userConsole")
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/pic/upload/:userId", uploadAvarter)
router.get("/find/:userId", findUser)
router.get("/findname/:userName", findUserByName)
router.get("/avatar/:userId", getAvatar)
router.post("/update", updateUser)
router.get("/", getUser)
module.exports = router