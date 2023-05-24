const router = require("express").Router();
const Order = require("../model/Order");
const Session = require("../model/Session");
const { v4: uuid4 } = require('uuid');

var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = process.env.API_KEY;

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
      planFee: req.body.planFee,
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

  var orderObjectFinding = await Order.findOne({ orderId: orderId });
  var sessionId=orderObjectFinding.sessionId;
  var sessionObjectFinding = await Session.findOne({ sessionId: sessionId });
  
  // Sending Mail to User
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      subject: "Order Generated",
      sender: { email: "api@sendinblue.com", name: "Yoga Yatra" },
      replyTo: { email: "api@sendinblue.com", name: "Yoga Yatra" },
      to: [{ name: orderObjectFinding.name, email: orderObjectFinding.email }],
      htmlContent:
        "<html><body><h1> Your Order Generated Successfully </h1></body></html>" +
        "<html><body><h1> Session Name: </h1></body></html>" + sessionObjectFinding.sessionName + 
        "<html><body><h1> Session Time: </h1></body></html>" + sessionObjectFinding.sessionTime + 
        "<html><body><h1> Teacher Name: </h1></body></html>" + sessionObjectFinding.teacherName + 
        "<html><body><h1> Session Description: </h1></body></html>" + sessionObjectFinding.sessionDesc + 
        "<html><body><h1> Payment Type: </h1></body></html>" + orderObjectFinding.paymentType + 
        "<html><body><h1> Plan Duration: </h1></body></html>" + orderObjectFinding.planDuration + 
        "<html><body><h1> Plan Fee: </h1></body></html>" + orderObjectFinding.planFee
  });

  // Sending Mail to Company
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      subject: "Order Generated",
      sender: { email: "api@sendinblue.com", name: "Yoga Yatra" },
      replyTo: { email: "api@sendinblue.com", name: "Yoga Yatra" },
      to: [{ name: "Company", email: process.env.ADMIN_ID }],
      htmlContent:
        "<html><body><h1> User ID:  </h1></body></html>" + orderObjectFinding.userId + 
		"<html><body><h1> Name:  </h1></body></html>" + orderObjectFinding.name + 
		"<html><body><h1> Email:  </h1></body></html>" + orderObjectFinding.email + 
		"<html><body><h1> Mobile Number:  </h1></body></html>" + orderObjectFinding.mobileNumber + 
		"<html><body><h1> Payment Status:  </h1></body></html>" + orderObjectFinding.paymentStatus + 
		"<html><body><h1> Payment Type:  </h1></body></html>" + orderObjectFinding.paymentType + 
    "<html><body><h1> Session Name: </h1></body></html>" + sessionObjectFinding.sessionName + 
    "<html><body><h1> Session Time: </h1></body></html>" + sessionObjectFinding.sessionTime + 
    "<html><body><h1> Teacher Name: </h1></body></html>" + sessionObjectFinding.teacherName + 
    "<html><body><h1> Session Description: </h1></body></html>" + sessionObjectFinding.sessionDesc + 
    "<html><body><h1> Plan Duration: </h1></body></html>" + orderObjectFinding.planDuration + 
    "<html><body><h1> Plan Fee: </h1></body></html>" + orderObjectFinding.planFee
  });
  
  res.status(200).send({ resCode: 200, message: "Order Payment Type Updated Successfully, Email Sent Successfully!!", orderId: orderId });
});


router.get("/myOrders/:userId", async (req, res) => {
  var userId= req.params.userId;
  let ordersFinding = await Order.find({ userId: userId });
  
  res.status(200).send({ resCode: 200, myOrders: ordersFinding });
});

module.exports = router;