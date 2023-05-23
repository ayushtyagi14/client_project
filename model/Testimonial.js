const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const testimonialSchema= new mongoose.Schema({
    testimonialId: {
        type: String,
        required: true
    },
    testimonialPersonName: {
        type: String,
        required: true
    },
    testimonialPersonDesig: {
        type: String,
        required: true
    },
    testimonialContent: {
        type: String,
        required: true
    },
    testimonialPublishDate: {
        type: String,
        required: true
    },
    testimonialImgUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Testimonial',testimonialSchema);