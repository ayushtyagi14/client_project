const router = require("express").Router();
const Razorpay = require ("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
const crypto = require("crypto");
const Payment = require('../model/Payment')


router.post("/checkout", async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);
    
    res.status(200).json({ success: true, order });
});

router.post("/paymentVerification", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // // Database comes here

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });

    //Create a new user
    const user = new Payment({
        userId: userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });
  
    var savedUser = await user.save();

    res.status(200).send({ resCode: 200, message: "Payment Completed" });
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

router.get("/api/getkey", async (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

module.exports = router;
