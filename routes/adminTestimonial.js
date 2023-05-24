const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const Testimonial = require('../model/Testimonial')
const Session = require("../model/Session");
const User = require("../model/User");
const Order = require("../model/Order");
const Event = require("../model/Event");
const Gallery = require("../model/Gallery");
const Instructor = require("../model/Instructor");
const { v4: uuid4 } = require('uuid');
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const credentials =require("../key.json");

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dyna5ffxu', 
    api_key: '774914337673996', 
    api_secret: 'ssTaAoYMXIpCi2yCPlrPylKMqYE'
});

// admin.initializeApp({
//     credential:admin.credential.cert(credentials)
// });
const db=admin.firestore();

const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyBUzcv0uynW81VFtIUuCjmY-HoXpppjRLg",
    authDomain: "clientproject-51dde.firebaseapp.com",
    projectId: "clientproject-51dde",
    storageBucket: "clientproject-51dde.appspot.com",
    messagingSenderId: "643828897241",
    appId: "1:643828897241:web:5a1338927c75537fd3f5c8"
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });


// ----------------------------------------------- Create Testimonial -----------------------------------------------------------------
router.post('/makeTestimonial', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        const testimonialId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const filz = new Testimonial({
            testimonialId: testimonialId,
            testimonialPersonName: req.body.testimonialPersonName,
            testimonialPersonDesig: req.body.testimonialPersonDesig,
            testimonialContent: req.body.testimonialContent,
            testimonialPublishDate: currentDate,
            testimonialImgUrl: result.url
        })
        const response = filz.save();
    })

    res.status(200).send({ resCode: 200, message: "File, Testimonial Uploaded Successfully!!" });
});

// ----------------------------------------------- Get All Testimonials ------------------------------------------------------------------
router.get("/getAllTestimonials", async (req, res) => {
    var testimonials = await Testimonial.find();
    
    res.status(200).send({ resCode: 200, testimonials: testimonials });
});

// ----------------------------------------------- Update Testimonial ------------------------------------------------------------------
router.patch("/editTestimonial/:testimonialId", async (req, res) => {
    try {
        var testimonialId=req.params.testimonialId;
  
        let testimonialFinding = await Testimonial.findOne({ testimonialId: testimonialId });
  
        const updateTestimonial = await Testimonial.findByIdAndUpdate(testimonialFinding._id, req.body, {new: true});
        res.status(200).send(updateTestimonial);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

// ----------------------------------------------- Update Testimonial Img -----------------------------------------------------------------
router.post('/editTestimonialImg', async (req, res) => {
    const file=req.files.myFile;
    var testimonialId = req.body.testimonialId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Testimonial.updateOne(
            { testimonialId: testimonialId },
            { $set: { testimonialImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Testimonial Img Updated Successfully!!" });
});
  
// ----------------------------------------------- Delete Testimonial ------------------------------------------------------------------
router.post("/deleteTestimonial", async (req, res) => {
    let testimonialId=req.body.testimonialId;
    let testimonialFinding= await Testimonial.deleteOne({ testimonialId: testimonialId });
  
    res.status(200).send({ resCode: 200, message: "Testimonial Deleted Successfully!!" });
});

// ----------------------------------------------- Get Single Testimonial ------------------------------------------------------------------
router.get("/getSingleTestimonial/:testimonialId", async (req, res) => {
    var testimonialId=req.params.testimonialId;
    let testimonialFinding = await Testimonial.findOne({ testimonialId: testimonialId });
    
    res.status(200).send({ resCode: 200, testimonial: testimonialFinding });
});



// ----------------------------------------------- Create Session -----------------------------------------------------------------
router.post('/makeSession', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        
        const sessionId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const user = new Session({
            sessionId: sessionId,
            sessionName: req.body.sessionName,
            sessionTime: req.body.sessionTime,
            teacherName: req.body.teacherName,
            sessionPlan1Fee: req.body.sessionPlan1Fee,
            sessionPlan1Duration: req.body.sessionPlan1Duration,
            sessionPlan2Fee: req.body.sessionPlan2Fee,
            sessionPlan2Duration: req.body.sessionPlan2Duration,
            sessionPlan3Fee: req.body.sessionPlan3Fee,
            sessionPlan3Duration: req.body.sessionPlan3Duration,
            sessionDesc: req.body.sessionDesc,
            sessionPublishDate: currentDate,
            sessionImgUrl: result.url
        });
          
        var savedUser = user.save();
    })
    
    res.status(200).send({ resCode: 200, message: "New Session Added Successfully!!" });
});

// ----------------------------------------------- Get All Sessions ------------------------------------------------------------------
router.get("/getAllSessions", async (req, res) => {
    var sessions = await Session.find();
    
    res.status(200).send({ resCode: 200, sessions: sessions });
});

// ----------------------------------------------- Get Single Session ------------------------------------------------------------------
router.get("/getSingleSession/:sessionId", async (req, res) => {
    var sessionId=req.params.sessionId;
    let sessionFinding = await Session.findOne({ sessionId: sessionId });
    
    res.status(200).send({ resCode: 200, session: sessionFinding });
});

// ----------------------------------------------- Update Session ------------------------------------------------------------------
router.patch("/editSession/:sessionId", async (req, res) => {
    try {
        var sessionId=req.params.sessionId;
  
        let sessionFinding = await Session.findOne({ sessionId: sessionId });
  
        const updateSession = await Session.findByIdAndUpdate(sessionFinding._id, req.body, {new: true});
        res.status(200).send(updateSession);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

// ----------------------------------------------- Update Session Img -----------------------------------------------------------------
router.post('/editSessionImg', async (req, res) => {
    const file=req.files.myFile;
    var sessionId = req.body.sessionId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Session.updateOne(
            { sessionId: sessionId },
            { $set: { sessionImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Session Img Updated Successfully!!" });
});

// ----------------------------------------------- Delete Session ------------------------------------------------------------------
router.post("/deleteSession", async (req, res) => {
    let sessionId=req.body.sessionId;
    let sessionFinding= await Session.deleteOne({ sessionId: sessionId });
  
    res.status(200).send({ resCode: 200, message: "Session Deleted Successfully!!" });
});



// ----------------------------------------------- Get All Users ------------------------------------------------------------------
router.get("/getAllUsers", async (req, res) => {
    var users = await User.find();
    
    res.status(200).send({ resCode: 200, users: users });
});

// --------------------------------------------- Mark Payment Done ------------------------------------------------------------------
router.post("/markPaymentDone", async (req, res) => {
    var orderId= req.body.orderId;
    var dbResponse=await Order.updateOne(
      { orderId: orderId },
      { $set: { paymentStatus: "Completed" } }
    );

    res.status(200).send({ resCode: 200, message: "Order Payment Status Updated Successfully!!", orderId: orderId });
});

// ----------------------------------------------- Get All Orders ------------------------------------------------------------------
router.get("/getAllOrders", async (req, res) => {
    var orders = await Order.find();
    
    res.status(200).send({ resCode: 200, orders: orders });
});



// ----------------------------------------------- Create Event -----------------------------------------------------------------
router.post('/makeEvent', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        
        const eventId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const user = new Event({
            eventId: eventId,
            eventName: req.body.eventName,
            eventTime: req.body.eventTime,
            teacherName: req.body.teacherName,
            eventFee: req.body.eventFee,
            eventDuration: req.body.eventDuration,
            eventDesc: req.body.eventDesc,
            eventDate: req.body.eventDate,
            eventImgUrl: result.url
        });
          
        var savedUser = user.save();
    })
    
    res.status(200).send({ resCode: 200, message: "New Event Added Successfully!!" });
});

// ----------------------------------------------- Get All Events ------------------------------------------------------------------
router.get("/getAllEvents", async (req, res) => {
    var events = await Event.find();
    
    res.status(200).send({ resCode: 200, events: events });
});

// ----------------------------------------------- Get Single Event ------------------------------------------------------------------
router.get("/getSingleEvent/:eventId", async (req, res) => {
    var eventId=req.params.eventId;
  
    let eventFinding = await Event.findOne({ eventId: eventId });
    
    res.status(200).send({ resCode: 200, event: eventFinding });
});

// ----------------------------------------------- Update Event ------------------------------------------------------------------
router.patch("/editEvent/:eventId", async (req, res) => {
    try {
        var eventId=req.params.eventId;
  
        let eventFinding = await Event.findOne({ eventId: eventId });
  
        const updateEvent = await Event.findByIdAndUpdate(eventFinding._id, req.body, {new: true});
        res.status(200).send(updateEvent);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

// ----------------------------------------------- Update Event Img -----------------------------------------------------------------
router.post('/editEventImg', async (req, res) => {
    const file=req.files.myFile;
    var eventId = req.body.eventId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Event.updateOne(
            { eventId: eventId },
            { $set: { eventImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Event Img Updated Successfully!!" });
});

// ----------------------------------------------- Delete Event ------------------------------------------------------------------
router.post("/deleteEvent", async (req, res) => {
    let eventId=req.body.eventId;
    let eventFinding= await Event.deleteOne({ eventId: eventId });
  
    res.status(200).send({ resCode: 200, message: "Event Deleted Successfully!!" });
});




// ----------------------------------------------- Add Gallery Photo -----------------------------------------------------------------
router.post('/addGalleryPhoto', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        const photoId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const user = new Gallery({
            photoId: photoId,
            photoHeading: req.body.photoHeading,
            photoImgUrl: result.url
        });
          
        var savedUser = user.save();
    })
    
    res.status(200).send({ resCode: 200, message: "New Photo Added Successfully!!" });
});

// ----------------------------------------------- Get All Gallery Photos ------------------------------------------------------------------
router.get("/getAllGalleryPhotos", async (req, res) => {
    var photos = await Gallery.find();
    
    res.status(200).send({ resCode: 200, galleryPhotos: photos });
});

// ----------------------------------------------- Update Gallery Img -----------------------------------------------------------------
router.post('/editGalleryImg', async (req, res) => {
    const file=req.files.myFile;
    var photoId = req.body.photoId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Gallery.updateOne(
            { photoId: photoId },
            { $set: { photoImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Gallery Img Updated Successfully!!" });
});

// ----------------------------------------------- Get Single Gallery Photo ------------------------------------------------------------------
router.get("/getSingleGalleryPhoto/:photoId", async (req, res) => {
    var photoId=req.params.photoId;
    let photoFinding = await Gallery.findOne({ photoId: photoId });
    
    res.status(200).send({ resCode: 200, galleryPhoto: photoFinding });
});

// ----------------------------------------------- Delete a Gallery Photo ------------------------------------------------------------------
router.post("/deleteGalleryPhoto", async (req, res) => {
    let photoId=req.body.photoId;
    let mongoPhotoFinding= await Gallery.deleteOne({ photoId: photoId });

    res.status(200).send({ resCode: 200, message: "Gallery Photo Deleted Successfully!!" });
});




// ----------------------------------------------- Add Instructor -----------------------------------------------------------------
router.post('/addInstructor', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        const instructorId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const user = new Instructor({
            instructorId: instructorId,
            instructorName: req.body.instructorName,
            instructorDesc: req.body.instructorDesc,
            instructorImgUrl: result.url
        });
          
        var savedUser = user.save();
    })
    
    res.status(200).send({ resCode: 200, message: "New Instructor Added Successfully!!" });
});

// ----------------------------------------------- Get All Instructors ------------------------------------------------------------------
router.get("/getAllInstructors", async (req, res) => {
    var instructors = await Instructor.find();
    
    res.status(200).send({ resCode: 200, instructors: instructors });
});

// ----------------------------------------------- Get Single Instructor ------------------------------------------------------------------
router.get("/getSingleInstructor/:instructorId", async (req, res) => {
    var instructorId=req.params.instructorId;
    let instructorFinding = await Instructor.findOne({ instructorId: instructorId });
    
    res.status(200).send({ resCode: 200, instructor: instructorFinding });
});

// ----------------------------------------------- Delete an Instructor ------------------------------------------------------------------
router.post("/deleteInstructor", async (req, res) => {
    let instructorId=req.body.instructorId;
    let instructorFinding= await Instructor.deleteOne({ instructorId: instructorId });

    res.status(200).send({ resCode: 200, message: "Instructor Deleted Successfully!!" });
});

// ----------------------------------------------- Update Instructor Img -----------------------------------------------------------------
router.post('/editInstructorImg', async (req, res) => {
    const file=req.files.myFile;
    var instructorId = req.body.instructorId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Instructor.updateOne(
            { instructorId: instructorId },
            { $set: { instructorImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Instructor Img Updated Successfully!!" });
});

// ----------------------------------------------- Update Instructor ------------------------------------------------------------------
router.patch("/editInstructor/:instructorId", async (req, res) => {
    try {
        var instructorId=req.params.instructorId;
  
        let instructorFinding = await Instructor.findOne({ instructorId: instructorId });
  
        const updateInstructor = await Instructor.findByIdAndUpdate(instructorFinding._id, req.body, {new: true});
        res.status(200).send(updateInstructor);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;