const User = require('./userSchema');
const jwt = require('jsonwebtoken');


// Register a new user
exports.registerUser = async (req, res,) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            phone,
            address
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user by email   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //remove password from user object
        user.password = undefined;

        //generate jwt token
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).cookie('token', token).json({
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        
        const userId = req.user.userId;

        const user = await User.findOne({ userId }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};