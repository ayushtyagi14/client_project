const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model('Payment',paymentSchema);
