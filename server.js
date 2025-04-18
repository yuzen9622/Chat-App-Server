const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const msgRoute = require("./Routes/msgRoute");
const friendRoute = require("./Routes/friendRoute");
const fileupload = require("express-fileupload");

const app = express();
require("dotenv").config();
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(fileupload()).use("/users", userRoute);
app.use("/chat", chatRoute);
app.use("/msg", msgRoute);
app.use("/friend", friendRoute);
app.use("/upload", express.static("upload"));
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
app.listen(port, () => {
  console.log(`Server Started. Start at ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connection successful"))
  .catch((err) => console.log(err));
