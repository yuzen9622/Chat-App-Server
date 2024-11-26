const mongoose = require("mongoose");

const AvatarSchema = new mongoose.Schema(
  {
    userId: String,
    Avatar: Buffer,
  },
  {
    timestamps: true,
  }
);

const avatarModel = mongoose.model("Avatar", AvatarSchema);
module.exports = avatarModel;
