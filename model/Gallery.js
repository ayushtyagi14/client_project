const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const gallerySchema= new mongoose.Schema({
    photoId: {
        type: String,
        required: true
    },
    photoHeading: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Gallery',gallerySchema);