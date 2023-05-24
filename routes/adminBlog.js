const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const Blog = require('../model/Blog')
const { v4: uuid4 } = require('uuid');
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const credentials =require("../key.json");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({ 
    cloud_name: 'dyna5ffxu', 
    api_key: '774914337673996', 
    api_secret: 'ssTaAoYMXIpCi2yCPlrPylKMqYE'
});

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
router.post('/makeBlog', async (req, res) => {
    const file=req.files.myFile;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        const blogId=uuid4();

        //Forming Current Date
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let currentDate = `${day}-${month}-${year}`;

        const filz = new Blog({
            blogId: blogId,
            blogHeading: req.body.blogHeading,
            blogContent: req.body.blogContent,
            blogPublishDate: currentDate,
            blogImgUrl: result.url
        })
        const response = filz.save();
    })

    res.status(200).send({ resCode: 200, message: "File, Blog Uploaded Successfully!!" });
});

// ----------------------------------------------- Get All Blogs ------------------------------------------------------------------
router.get("/getAllBlogs", async (req, res) => {
    var blogs = await Blog.find();
    
    res.status(200).send({ resCode: 200, blogs: blogs });
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

// ----------------------------------------------- Update Blog Img -----------------------------------------------------------------
router.post('/editBlogImg', async (req, res) => {
    const file=req.files.myFile;
    var blogId = req.body.blogId;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log(result);

        var dbResponse= await Blog.updateOne(
            { blogId: blogId },
            { $set: { blogImgUrl: result.url } }
        );
    });

    res.status(200).send({ resCode: 200, message: "Blog Img Updated Successfully!!" });
});
  
// ----------------------------------------------- Delete Blog ------------------------------------------------------------------
router.post("/deleteBlog", async (req, res) => {
    let blogId=req.body.blogId;
    let blogFinding= await Blog.deleteOne({ blogId: blogId });
  
    res.status(200).send({ resCode: 200, message: "Blog Deleted Successfully!!" });
});


module.exports = router;