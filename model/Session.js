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
    sessionPlan1Fee: {
        type: Number,
        required: true
    },
    sessionPlan1Duration: {
        type: Number,
        required: true
    },
    sessionPlan2Fee: {
        type: Number,
        required: true
    },
    sessionPlan2Duration: {
        type: Number,
        required: true
    },
    sessionPlan3Fee: {
        type: Number,
        required: true
    },
    sessionPlan3Duration: {
        type: Number,
        required: true
    },
    sessionDesc: {
        type: String,
        required: true
    },
    sessionPublishDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Session',sessionSchema);