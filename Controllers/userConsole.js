const userModel = require("../Database/userData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require('path')
const fs = require('fs')
const sharp = require('sharp');

const createtoken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" })
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        let user = await userModel.findOne({ email });

        if (user) return res.status(400).json("電子郵件已被使用...");
        if (!name || !password || !email) {
            return res.status(400).json("請填寫所有輸入框!");
        }
        if (!validator.isEmail(email)) return res.status(400).json("不是正確的電子郵件格式");
        user = new userModel({ name, email, password })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();

        const token = createtoken(user._id)

        res.status(200).json({ _id: user._id, name, email, token })
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }

}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user == null) return res.status(400).json("電子郵件不正確")
        let Validpassword = await bcrypt.compare(password, user.password)
        if (!Validpassword) return res.status(400).json("密碼不正確")

        const token = createtoken(user._id)
        if (user && Validpassword) return res.status(200).json({ _id: user._id, name: user.name, email, token, Avatar: user.Avatar })
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId)
        if (user) return res.status(200).json(user)

    } catch (err) {
        console.error(err);
    }
}
const findUserByName = async (req, res) => {
    const userName = req.params.userName;
    try {
        const user = await userModel.find({ "name": { "$regex": userName } })
        if (user) return res.status(200).json(user)
    } catch (err) {
        console.error(err);
    }
}
const getUser = async (req, res) => {

    try {
        const user = await userModel.find()

        res.status(200).json(user)
    } catch (err) {
        console.error(err);
    }
}
const uploadAvarter = async (req, res) => {
    try {
        const { img } = req.files;
        const userId = req.body.userId
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.find(type => type == img.mimetype)) throw "error";
        const imgname = userId + '.jpg'
        const dbpath = path.join(path.join('upload/')) + imgname
        const imgpath = path.join(path.join(path.dirname(require.main.filename), '/upload/')) + imgname;
        const imgBuffer = await sharp(img.data).resize({ width: 300, height: 300 }).png().toBuffer()

        await userModel.findByIdAndUpdate(
            userId, { Avatar: imgBuffer }, { new: true }
        ).then((data) => {

            return res.status(200).json(data)
        })

    } catch (error) {
        return res.status(500).json(error)
    }

}
const getAvatar = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await userModel.findById(userId);
        if (user) {
            res.set('Content-Type', 'image/png')
            res.send(user.Avatar)
        }
    } catch (err) {

    }
}

module.exports = { getAvatar, registerUser, loginUser, findUser, getUser, findUserByName, uploadAvarter }