const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const Session = require("../model/Session");
const { v4: uuid4 } = require('uuid');
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const credentials =require("../key.json");

// admin.initializeApp({
//     credential:admin.credential.cert(credentials)
// });

// const db=admin.firestore();

// const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// const firebaseConfig = {
//     apiKey: "AIzaSyBUzcv0uynW81VFtIUuCjmY-HoXpppjRLg",
//     authDomain: "clientproject-51dde.firebaseapp.com",
//     projectId: "clientproject-51dde",
//     storageBucket: "clientproject-51dde.appspot.com",
//     messagingSenderId: "643828897241",
//     appId: "1:643828897241:web:5a1338927c75537fd3f5c8"
// };

// firebase.initializeApp(firebaseConfig);

// const storage = getStorage();
// const upload = multer({ storage: multer.memoryStorage() });

router.post("/makeSession", async (req, res) => {
//   const storageRef = ref(storage, `sessions/${req.file.originalname}`);
//   const sessionId=uuid4();

  //Forming Current Date
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;
  // console.log(currentDate); // "17-6-2022"

//   const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
//     console.log("file uploaded");
//     getDownloadURL(ref(storage, `sessions/${req.file.originalname}`)).then((url)=> {
//       console.log("URL: "+url);

//       try{
//         const userJson={
//             sessionId: sessionId,
//             sessionImgURL: url
//         };
//         const response=db.collection("sessions").doc(sessionId).set(userJson);
//         console.log(userJson);
//     } catch(error) {
//         console.log(error);
//     }
  
//     });
//   });

//   console.log(req.file);

//     //Create a new session
    const user = new Session({
      sessionId: uuid4(),
      sessionName: req.body.sessionName,
      sessionTime: req.body.sessionTime,
      teacherName: req.body.teacherName,
      sessionFee: req.body.sessionFee,
      sessionRegisFee: req.body.sessionRegisFee,
      sessionDuration: req.body.sessionDuration,
      sessionDesc: req.body.sessionDesc,
      sessionPublishDate: currentDate,
    });

    var savedUser = await user.save();
    res.status(200).send({ resCode: 200, message: "New Session Added Successfully!!" });
});


router.post("/deleteSession", async (req, res) => {
  let sessionId=req.body.sessionId;
  let sessionFinding= await Session.deleteOne({ sessionId: sessionId });

  res.status(200).send({ resCode: 200, message: "Session Deleted Successfully!!" });
});


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


router.get("/getAllSessions", async (req, res) => {
  var sessions = await Session.find();
  res.status(200).send({ resCode: 200, sessions: sessions });
});


module.exports = router;