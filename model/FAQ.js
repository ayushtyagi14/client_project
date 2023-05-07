const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const faqSchema= new mongoose.Schema({
    faqId: {
        type: String,
        required: true
    },
    faqHeading: {
        type: String,
        required: true
    },
    faqDesc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('FAQ',faqSchema);