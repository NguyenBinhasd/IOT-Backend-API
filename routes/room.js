const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Room = require('../models/Room');

router.get('/', verifyToken, async (req, res) => {
    try{
        const room = await Room.find({user: req.userId}).populate('user', ['username']);

        await res.json({success: true, room});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
});

router.post('/', verifyToken, async (req, res) => {
    const {roomName} = req.body;

    if(!roomName) 
        return res.status(400).json({success: false, message:"Room name is required"});

    try{
        const newRoom = new Room({
            name: roomName,
            devices: [],
            user: req.userId
        });
        await newRoom.save();
        res.json({success: true, message: "Room created successfully"});

    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message:"Internal server error"});
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const {deviceName, type, status} = req.body;

    if(!deviceName)
        return res.status(400).json({success: false, message:"Device name is required"});

    try {
        let newDevice = {
            "name": deviceName,
            "type": type,
            "status": status
        }

        const addDeviceCondition = {_id: req.params.id, user: req.userId}

        newDevice = await Room.findOneAndUpdate(addDeviceCondition, {$push: {devices: newDevice}});

        if(!newDevice) 
            return res.status(401).json({success: false, message: 'Room not found or you dont have enough permit to add more devices'});

        res.json({success: true, message: "Add device Successfully"});

    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message:"Internal server error"});
    }

});


module.exports = router;