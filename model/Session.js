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
    sessionTime: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    sessionFee: {
        type: Number,
        required: true
    },
    sessionRegisFee: {
        type: Number,
        required: true
    },
    sessionDuration: {
        type: Number,
        required: true
    },
    sessionDesc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Session',sessionSchema);