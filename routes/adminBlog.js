const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const Blog = require('../model/Blog')
const { v4: uuid4 } = require('uuid');
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const credentials =require("../key.json");

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});
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


// ----------------------------------------------- Create Blog -----------------------------------------------------------------
router.post('/makeBlog', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `blogs/${req.file.originalname}`);
    const blogId=uuid4();

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("file uploaded");
      getDownloadURL(ref(storage, `blogs/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              blogId: blogId,
              blogImgURL: url
          };
          const response=db.collection("blogs").doc(blogId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const file = new Blog({
        blogId: blogId,
        blogHeading: req.body.blogHeading,
        blogContent: req.body.blogContent,
        blogPublishDate: currentDate,
    })
    const response = await file.save();

    res.status(200).send({ resCode: 200, message: "File, Blog Uploaded Successfully!!" });
});


// ----------------------------------------------- Get All Blogs ------------------------------------------------------------------
router.get("/getAllBlogs", async (req, res) => {
    var blogs = await Blog.find();
    let arr=[];

    for(let j=0;j<blogs.length;j++)
    {
        let x={
            ...blogs[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("blogs").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].blogId == blogs[j].blogId)
            {
                k.blogImg= list[i].blogImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, blogs: arr });
});

// ----------------------------------------------- Update Blog ------------------------------------------------------------------
router.patch("/editBlog/:blogId", async (req, res) => {
    try {
        var blogId=req.params.blogId;
  
        let blogFinding = await Blog.findOne({ blogId: blogId });
  
        const updateBlog = await Blog.findByIdAndUpdate(blogFinding._id, req.body, {new: true});
        res.status(200).send(updateBlog);
    }
    catch(e) {
        res.status(400).send(e);
    }
});
  
// ----------------------------------------------- Delete Blog ------------------------------------------------------------------
router.post("/deleteBlog", async (req, res) => {
    let blogId=req.body.blogId;
    let blogFinding= await Blog.deleteOne({ blogId: blogId });
  
    res.status(200).send({ resCode: 200, message: "Blog Deleted Successfully!!" });
});


module.exports = router;