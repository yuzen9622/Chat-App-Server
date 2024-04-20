const express = require("express");
const { createFriend, deleteFriend, findFriend } = require("../Controllers/followConsole");
const router = express.Router();

router.post('/create',createFriend)
router.post('/delete',deleteFriend)
router.get('/:userId',findFriend)
module.exports = router