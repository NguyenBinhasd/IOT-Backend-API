require('dotenv').config();
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) 
        return res.status(400).json({success: false, message: "You are missing something"});

    try{
        const user = await User.findOne({username});

        if(user)
            return res.status(400).json({success: false, message: "Username already exists"});

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET);
        res.json({success: true, message: "register successfully", accessToken});

    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password)
        return res.status(400).json({success: false, message: "You are missing something"});
    
    try {
        const user = await User.findOne({username});

        if(!user)
            return res.status(400).json({success: false, message: "This user does not exists"});

        const validPassword = await argon2.verify(user.password, password);

        if(!validPassword)
            return res.status(400).json({success: false, message: "This user does not exists"});

        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET);
        res.json({success: true, message: "Login Successfully", accessToken});

    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message:"Internal server error"});
    }
});

module.exports = router