const mongoose=require('mongoose');


const FollowSchema=new mongoose.Schema({
    members:Array
}, 
{
    timestamps: true,
})

const followModel = mongoose.model("Follow", FollowSchema)
module.exports = followModel;