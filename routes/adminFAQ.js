const router = require('express').Router();
const FAQ = require("../model/FAQ");
const { v4: uuid4 } = require('uuid');

//--------------------------------------------------- Add FAQ ------------------------------------------------------------------
router.post("/addFAQ", async (req, res) => {
    const faqId=uuid4();

    const data = new FAQ({
        faqId: faqId,
        faqHeading: req.body.faqHeading,
        faqDesc: req.body.faqDesc
    });
    const response = await data.save();

    res.status(200).send({ resCode: 200, message: "FAQ Added Successfully!!" });
});

// ----------------------------------------------- Get All FAQs ------------------------------------------------------------------
router.get("/getAllFAQs", async (req, res) => {
    var faqs = await FAQ.find();
    res.status(200).send({ resCode: 200, faqs: faqs });
});

// ----------------------------------------------- Update FAQ ------------------------------------------------------------------
router.patch("/editFAQ/:faqId", async (req, res) => {
    try {
        var faqId=req.params.faqId;
  
        let faqFinding = await FAQ.findOne({ faqId: faqId });
  
        const updateFAQ = await FAQ.findByIdAndUpdate(faqFinding._id, req.body, {new: true});
        res.status(200).send(updateFAQ);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

// ----------------------------------------------- Delete FAQ ------------------------------------------------------------------
router.post("/deleteFAQ", async (req, res) => {
    let faqFinding= await FAQ.deleteOne({ faqId: req.body.faqId });

    res.status(200).send({ resCode: 200, message: "FAQ Deleted Successfully!!" });
});


module.exports = router;