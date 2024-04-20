const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 100,
    },
    bio: {
      type: String,
      maxlength: 100,
    },
    Avatar: {
      type: Buffer,
    },
    email_id: {
      type: String,
    },
    OTP: {
      type: Number,
      maxlength: 4,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
