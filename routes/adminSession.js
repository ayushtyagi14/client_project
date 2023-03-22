const router = require("express").Router();
const Session = require("../model/Session");
const { v4: uuid4 } = require('uuid');

router.post("/makeSession", async (req, res) => {
    //Create a new user
    const user = new Session({
      sessionId: uuid4(),
      sessionName: req.body.sessionName,
      sessionTiming: req.body.sessionTiming,
      teacherName: req.body.teacherName,
      price: req.body.price,
      duration: req.body.duration
    });

    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Session Added Successfully!!" });
});


router.post("/deleteSession", async (req, res) => {
  let sessionId=req.body.sessionId;
  let sessionFinding= await Session.deleteOne({ sessionId: sessionId });

  res.status(200).send({ resCode: 200, message: "Session Deleted Successfully!!" });
});


module.exports = router;