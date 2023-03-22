const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const orderSchema= new mongoose.Schema({
    orderId: {
        type: String,
        default: "Null"
    },
    userId: {
        type: String,
        default: "Null"
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
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Order',orderSchema);