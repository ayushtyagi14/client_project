const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const orderSchema= new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    mobileNumber: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherNumber: {
        type: Number,
        required: true
    },
    fatherNumber: {
        type: Number,
        required: true
    },
    guardianName: {
        type: String,
        required: true
    },
    guardianNumber: {
        type: Number,
        required: true
    },
    know: {
        type: String,
        required: true
    },
    primaryGoals: {
        type: String,
        required: true
    },
    yogaBefore: {
        type: String,
        required: true
    },
    healthConcerns: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Order',orderSchema);