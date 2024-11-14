const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the token is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];
            console.log('Received Token:', token);  // Debugging

            // Verify the token using the secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token:', decoded);  // Debugging

            // Fetch the user and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('User not found for this token');
                return res.status(404).json({ message: 'User not found' });
            }

            next();  // Proceed to the next middleware or route
        } catch (error) {
            console.error('Token Verification Error:', error.message);  // Debugging
            res.status(401).json({ message: 'You are not authorized, invalid token' });
        }
    } else {
        console.log('No Authorization Header Found');  // Debugging
        res.status(401).json({ message: 'Not authorized, token missing' });
    }
});

module.exports = { protect };
