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
        if(name.length<3) return res.status(400).json("名稱請超過三個字元!")
        if(password.length<8) return res.status(400).json("密碼必須超過七個字元")
        if (!validator.isEmail(email)) return res.status(400).json("不是正確的電子郵件格式");
        const spliceEmail = (email) => {
            const mailId = email.split("@");
            const id = "@" + mailId[0];
            return id
        }
        
        const email_id = spliceEmail(email)
        user = new userModel({ name, email, password, bio: "", email_id: email_id })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();

        const token = createtoken(user._id)

        res.status(200).json({ _id: user._id, name, email, token, email_id })
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
        if (user && Validpassword) return res.status(200).json({ _id: user._id, name: user.name, email, token, Avatar: user.Avatar, bio: user.bio })
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
        const user = await userModel.find({ $or: [{ "name": { "$regex": userName, "$options": "i" } }, { "email_id": userName }] })
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
        if(!img||!userId)return res.status(200).json("無照片或Id");
        if (!allowedTypes.find(type => type == img.mimetype)) return res.status(200).json("照片格式不對")
        const imgBuffer = await sharp(img.data).resize({ width: 300, height: 300 }).toBuffer()

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
        if (user && user.Avatar) {
            res.set('Content-Type', 'image/png')
            res.send(user.Avatar)
        }
    } catch (err) {
        res.status(404).send("not found")
    }
}
const updateUser = async (req, res) => {
    const { userId, name, email, bio } = req.body
    try {
        if (!email && !name) return res.send(req.body)
        await userModel.findByIdAndUpdate(userId, { name: name, email: email, bio: bio }, { new: true })
            .then((data) => {
                res.status(200).send(data)
            })
    } catch (error) {

    }
}
module.exports = { getAvatar, registerUser, loginUser, findUser, getUser, findUserByName, uploadAvarter, updateUser }