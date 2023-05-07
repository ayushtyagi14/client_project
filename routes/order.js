const router = require("express").Router();
const User = require("../model/User");
const Order = require("../model/Order");
const Session = require("../model/Session");
const { v4: uuid4 } = require('uuid');

router.post("/order", async (req, res) => {
    var userId= req.body.userId;
    var sessionId = req.body.sessionId;
    var sessionObjectFinding = await Session.findOne({ sessionId: sessionId });
    var orderId = uuid4();

    //Create a new user
    const user = new Order({
      orderId: orderId,
      userId: userId,
      sessionId: sessionId,
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      gender: req.body.gender,
      dob: req.body.dob,
      age: req.body.age,
      address: req.body.address,
      motherName: req.body.motherName,
      fatherName: req.body.fatherName,
      motherNumber: req.body.motherNumber,
      fatherNumber: req.body.fatherNumber,
      guardianName: req.body.guardianName,
      guardianNumber: req.body.guardianNumber,
      know: req.body.know,
      primaryGoals: req.body.primaryGoals,
      yogaBefore: req.body.yogaBefore,
      healthConcerns: req.body.healthConcerns,
      planDuration: req.body.planDuration,
      paymentStatus: "Pending",
      paymentType: "Not Specified"
    });

    var savedUser = await user.save();

    res.status(200).send({ resCode: 200, message: "Order Requested", sessionDetails: sessionObjectFinding, orderId: orderId });
});


router.post("/orderPaymentType", async (req, res) => {
  var orderId= req.body.orderId;
  var dbResponse=await Order.updateOne(
    { orderId: orderId },
    { $set: { paymentType: req.body.paymentType } }
  );

  var orderDetails = await Order.findOne({ orderId: orderId });
  var sessionID = orderDetails.sessionId;
  var sessionObjectFinding = await Session.findOne({ sessionId: sessionID });
  var sessionPrice = sessionObjectFinding.sessionFee;

  var planDuration = orderDetails.planDuration;

  res.status(200).send({ resCode: 200, message: "Order Payment Type Updated Successfully!!", orderId: orderId, totalAmount: planDuration*sessionPrice });
});


router.get("/myOrders/:userId", async (req, res) => {
  var userId= req.params.userId;
  let ordersFinding = await Order.find({ userId: userId });
  
  res.status(200).send({ resCode: 200, myOrders: ordersFinding });
});

module.exports = router;