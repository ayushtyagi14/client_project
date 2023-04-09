const express = require('express');
const app= express();
const dotenv=require('dotenv');
const port = process.env.PORT || 3000;
const mongoose=require('mongoose');

//IMPORT ROUTES
const authRoute=require('./routes/auth');
const orderRoute=require('./routes/order');
const sessionRoute=require('./routes/session');
const paymentRoute=require('./routes/payment');
const adminBlogRoute=require('./routes/adminBlog');
const adminTestimonialRoute=require('./routes/adminTestimonial');
const postRoute=require('./routes/posts');
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, },() => console.log('Connected to Database'));

//MIDDLEWARES
app.use(express.json());

// ROUTE MIDDLESWARES
app.use('/api/user',authRoute);
app.use('/api/user',orderRoute);
app.use('/api/user',sessionRoute);
app.use('/api/user',paymentRoute);
app.use('/api/admin',adminBlogRoute);
app.use('/api/admin',adminTestimonialRoute);
app.use('/api/posts',postRoute);

app.listen(port,() => {
    console.log(`Server is running at Port Number ${port}`);
});