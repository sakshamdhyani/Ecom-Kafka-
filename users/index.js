const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { registerUser, loginUser, getUserProfile } = require('./userController');
const router = express.Router();
const mongoose = require('mongoose');
const isAuth = require('./authMiddleware');




// Load environment variables from .env file
dotenv.config();
const app = express();



// Middleware setup
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());




// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});



//routes
app.use('/api/users', router);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', isAuth , getUserProfile);





app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});