const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin')

// for testing JWT
/* router.get('/protected', requireLogin, (req,res) => {
    res.send('Hello')
}) */

router.post('/signup', (req,res) => {
    const { name,email,password,pic } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({error:"pleace fill all field!"})
    }
    User.findOne({email:email})
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).jaon({
                    error: "user already exists with that email"
                })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name,
                        pic
                    })
        
                    user.save()
                        .then(user => {
                            res.status(201).json({
                                message:"Successfully registred!!!"
                            })
                        })
                            .catch(err => {
                                console.log(err);
                            })
                })
                    .catch(err => {
                        console.log(err);
                    })
                })
            

})

router.post('/signin', (req,res) => {
    const {email, password} = req.body
    if (!email || !password){
        return res.status(422).json({error:"please add email and password"})
    }
    User.findOne({email:email})
        .then(savedUser => {
            if (!savedUser) {
                return res.json(422).json({error:"Invalid Email or Password"})
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message: "Successfully signin"})
                        const token = jwt.sign({ _id:savedUser._id }, JWT_SECRET) /* (req for jwt token) */
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({token,user:{ _id, name, email, followers, following, pic }}) /* (res for jwt token) */
                    } else {
                        return res.status(422).json({error:"Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router