const router = require("express").Router();
const User = require("../model/User");
const Order = require("../model/Order");
const { v4: uuid4 } = require('uuid');

router.post("/order", async (req, res) => {
    var userId= req.body.userId;
    var objectFinding = await User.findOne({ userId: userId });

    //Create a new user
    const user = new Order({
      orderId: uuid4(),
      userId: userId,
      name: objectFinding.name,
      email: objectFinding.email,
      mobileNumber: objectFinding.mobileNumber,
      price: req.body.price,
      duration: req.body.duration,
      timeSlot: req.body.timeSlot,
      paymentStatus: "Pending"
    });

    var savedUser = await user.save();

    res.status(200).send({ resCode: 200, message: "Order Requested" });
});

module.exports = router;