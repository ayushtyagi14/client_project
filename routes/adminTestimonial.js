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
router.post('/makeTestimonial', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `testimonials/${req.file.originalname}`);
    const testimonialId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `testimonials/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              testimonialId: testimonialId,
              testimonialImgURL: url
          };
          const response=db.collection("testimonials").doc(testimonialId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const file = new Testimonial({
        testimonialId: testimonialId,
        testimonialPersonName: req.body.testimonialPersonName,
        testimonialPersonDesig: req.body.testimonialPersonDesig,
        testimonialContent: req.body.testimonialContent,
        testimonialPublishDate: currentDate,
    })
    const response = await file.save();

    res.status(200).send({ resCode: 200, message: "File, Testimonial Uploaded Successfully!!" });
});

// ----------------------------------------------- Get All Testimonials ------------------------------------------------------------------
router.get("/getAllTestimonials", async (req, res) => {
    var testimonials = await Testimonial.find();
    let arr=[];

    for(let j=0;j<testimonials.length;j++)
    {
        let x={
            ...testimonials[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("testimonials").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].testimonialId == testimonials[j].testimonialId)
            {
                k.testimonialImg= list[i].testimonialImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, testimonials: arr });
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
  
// ----------------------------------------------- Delete Testimonial ------------------------------------------------------------------
router.post("/deleteTestimonial", async (req, res) => {
    let testimonialId=req.body.testimonialId;
    let testimonialFinding= await Testimonial.deleteOne({ testimonialId: testimonialId });
  
    res.status(200).send({ resCode: 200, message: "Testimonial Deleted Successfully!!" });
});



// ----------------------------------------------- Create Session -----------------------------------------------------------------
router.post('/makeSession', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `sessions/${req.file.originalname}`);
    const sessionId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `sessions/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              sessionId: sessionId,
              sessionImgURL: url
          };
          const response=db.collection("sessions").doc(sessionId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

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
    });
      
    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Session Added Successfully!!" });
});

// ----------------------------------------------- Get All Sessions ------------------------------------------------------------------
router.get("/getAllSessions", async (req, res) => {
    var sessions = await Session.find();
    let arr=[];

    for(let j=0;j<sessions.length;j++)
    {
        let x={
            ...sessions[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("sessions").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].sessionId == sessions[j].sessionId)
            {
                k.sessionImg= list[i].sessionImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, sessions: arr });
});

// ----------------------------------------------- Get Single Session ------------------------------------------------------------------
router.get("/getSingleSession/:sessionId", async (req, res) => {
    var sessionId=req.params.sessionId;
  
    let sessionFinding = await Session.findOne({ sessionId: sessionId });
    let arr=[];

    let x={
        ...sessionFinding
    };
    let k=x._doc;

    const snapshot=await db.collection("sessions").get();
    const list=snapshot.docs.map((doc)=>doc.data());
    
    for(let i=0;i<list.length;i++)
    {
        if(list[i].sessionId == sessionFinding.sessionId)
        {
            k.sessionImg= list[i].sessionImgURL;
        }
    }
    
    res.status(200).send({ resCode: 200, session: k });
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
router.post('/makeEvent', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `events/${req.file.originalname}`);
    const eventId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `events/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              eventId: eventId,
              eventImgURL: url
          };
          const response=db.collection("events").doc(eventId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const user = new Event({
        eventId: eventId,
        eventName: req.body.eventName,
        eventTime: req.body.eventTime,
        teacherName: req.body.teacherName,
        eventFee: req.body.eventFee,
        eventDuration: req.body.eventDuration,
        eventDesc: req.body.eventDesc,
        eventDate: req.body.eventDate
    });
      
    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Event Added Successfully!!" });
});

// ----------------------------------------------- Get All Events ------------------------------------------------------------------
router.get("/getAllEvents", async (req, res) => {
    var events = await Event.find();
    let arr=[];

    for(let j=0;j<events.length;j++)
    {
        let x={
            ...events[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("events").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].eventId == events[j].eventId)
            {
                k.eventImg= list[i].eventImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, events: arr });
});

// ----------------------------------------------- Get Single Event ------------------------------------------------------------------
router.get("/getSingleEvent/:eventId", async (req, res) => {
    var eventId=req.params.eventId;
  
    let eventFinding = await Event.findOne({ eventId: eventId });
    let arr=[];

    let x={
        ...eventFinding
    };
    let k=x._doc;

    const snapshot=await db.collection("events").get();
    const list=snapshot.docs.map((doc)=>doc.data());
    
    for(let i=0;i<list.length;i++)
    {
        if(list[i].eventId == eventFinding.eventId)
        {
            k.eventImg= list[i].eventImgURL;
        }
    }
    
    res.status(200).send({ resCode: 200, event: k });
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

// ----------------------------------------------- Delete Event ------------------------------------------------------------------
router.post("/deleteEvent", async (req, res) => {
    let eventId=req.body.eventId;
    let eventFinding= await Event.deleteOne({ eventId: eventId });
  
    res.status(200).send({ resCode: 200, message: "Event Deleted Successfully!!" });
});




// ----------------------------------------------- Add Gallery Photo -----------------------------------------------------------------
router.post('/addGalleryPhoto', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `galleryPhotos/${req.file.originalname}`);
    console.log(req.file.originalname);
    const photoId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `galleryPhotos/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              photoId: photoId,
              galleryImgURL: url
          };
          const response=db.collection("galleryPhotos").doc(photoId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const user = new Gallery({
        photoId: photoId,
        photoHeading: req.body.photoHeading
    });
      
    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Photo Added Successfully!!" });
});

// ----------------------------------------------- Get All Gallery Photos ------------------------------------------------------------------
router.get("/getAllGalleryPhotos", async (req, res) => {
    var photos = await Gallery.find();
    let arr=[];

    for(let j=0;j<photos.length;j++)
    {
        let x={
            ...photos[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("galleryPhotos").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].photoId == photos[j].photoId)
            {
                k.galleryImg= list[i].galleryImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, galleryPhotos: arr });
});

// ----------------------------------------------- Get Single Gallery Photo ------------------------------------------------------------------
router.get("/getSingleGalleryPhoto/:photoId", async (req, res) => {
    var photoId=req.params.photoId;
  
    let photoFinding = await Gallery.findOne({ photoId: photoId });
    let arr=[];

    let x={
        ...photoFinding
    };
    let k=x._doc;

    const snapshot=await db.collection("galleryPhotos").get();
    const list=snapshot.docs.map((doc)=>doc.data());
    
    for(let i=0;i<list.length;i++)
    {
        if(list[i].photoId == photoFinding.photoId)
        {
            k.galleryImg= list[i].galleryImgURL;
        }
    }
    
    res.status(200).send({ resCode: 200, galleryPhoto: k });
});

// ----------------------------------------------- Delete a Gallery Photo ------------------------------------------------------------------
router.post("/deleteGalleryPhoto", async (req, res) => {
    let photoId=req.body.photoId;
    let mongoPhotoFinding= await Gallery.deleteOne({ photoId: photoId });

    res.status(200).send({ resCode: 200, message: "Gallery Photo Deleted Successfully!!" });
});




// ----------------------------------------------- Add Instructor -----------------------------------------------------------------
router.post('/addInstructor', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `instructors/${req.file.originalname}`);
    console.log(req.file.originalname);
    const instructorId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `instructors/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              instructorId: instructorId,
              instructorImgURL: url
          };
          const response=db.collection("instructors").doc(instructorId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const user = new Instructor({
        instructorId: instructorId,
        instructorName: req.body.instructorName,
        instructorDesc: req.body.instructorDesc
    });
      
    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Instructor Added Successfully!!" });
});

// ----------------------------------------------- Get All Instructors ------------------------------------------------------------------
router.get("/getAllInstructors", async (req, res) => {
    var instructors = await Instructor.find();
    let arr=[];

    for(let j=0;j<instructors.length;j++)
    {
        let x={
            ...instructors[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("instructors").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].instructorId == instructors[j].instructorId)
            {
                k.instructorImg= list[i].instructorImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, instructors: arr });
});

// ----------------------------------------------- Get Single Instructor ------------------------------------------------------------------
router.get("/getSingleInstructor/:instructorId", async (req, res) => {
    var instructorId=req.params.instructorId;
  
    let instructorFinding = await Instructor.findOne({ instructorId: instructorId });
    let arr=[];

    let x={
        ...instructorFinding
    };
    let k=x._doc;

    const snapshot=await db.collection("instructors").get();
    const list=snapshot.docs.map((doc)=>doc.data());
    
    for(let i=0;i<list.length;i++)
    {
        if(list[i].instructorId == instructorFinding.instructorId)
        {
            k.instructorImg= list[i].instructorImgURL;
        }
    }
    
    res.status(200).send({ resCode: 200, instructor: k });
});

// ----------------------------------------------- Delete an Instructor ------------------------------------------------------------------
router.post("/deleteInstructor", async (req, res) => {
    let instructorId=req.body.instructorId;
    let instructorFinding= await Instructor.deleteOne({ instructorId: instructorId });

    res.status(200).send({ resCode: 200, message: "Instructor Deleted Successfully!!" });
});

module.exports = router;