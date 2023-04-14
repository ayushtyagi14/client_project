const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const eventSchema= new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    eventFee: {
        type: Number,
        required: true
    },
    eventDuration: {
        type: String,
        required: true
    },
    eventDesc: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Event',eventSchema);