const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const instructorSchema= new mongoose.Schema({
    instructorId: {
        type: String,
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    instructorDesc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Instructor',instructorSchema);