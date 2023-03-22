const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const sessionSchema= new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    sessionName: {
        type: String,
        required: true
    },
    sessionTiming: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Session',sessionSchema);