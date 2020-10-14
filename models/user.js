const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: "https://res.cloudinary.com/aj-dev/image/upload/v1602561684/no_pic_up96p1.png"
    },
    followers:[
                {
                    type: ObjectId,
                    ref: "User"
                }
    ],
    following:[
                {
                    type: ObjectId,
                    ref: "User"
                }
    ]
});

mongoose.model("User", userSchema);