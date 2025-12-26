const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2; //! Cloudinary is being required
const expressFileUpload = require("express-fileupload");
const routes = require("./routes");


// Load environment variables from .env file
dotenv.config();
const app = express();



// Middleware setup
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressFileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp'
}))



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


//connect cloudinary
try {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    console.log("CLOUDINARY CONNECTED SUCCESSFULLY")
} catch (error) {
    console.log(error);
}



// routes
app.use('/products', routes);



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});