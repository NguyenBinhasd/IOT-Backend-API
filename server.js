require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const roomRoute = require('./routes/room');


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@iot.qq3sv.mongodb.net/iot?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected');
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

connectDB();
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);

app.listen(5000, () => {
    console.log('Your server is listened in port 5000')
})