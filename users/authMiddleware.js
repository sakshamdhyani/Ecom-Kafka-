const User = require('./userSchema');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user using JWT
const isAuth = (req,res,next) => {

    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }

}

module.exports = isAuth;