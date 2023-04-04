const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const blogSchema= new mongoose.Schema({
    blogId: {
        type: String,
        required: true
    },
    blogHeading: {
        type: String,
        required: true
    },
    blogContent: {
        type: String,
        required: true
    },
    blogPublishDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Blog',blogSchema);