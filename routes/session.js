const router = require("express").Router();
const Session = require("../model/Session");

router.get("/getAllSession", async (req, res) => {
    var sessions = await Session.find();
    res.status(200).send({ resCode: 200, sessions: sessions });
});


router.get("/getSession/:sessionId", async function (req, res) {
    var sessionId = req.params['sessionId'];
    var objectFinding = await Session.findOne({ sessionId: sessionId });
  
    res.status(200).send({ resCode: 200, session: objectFinding });
});

module.exports = router;