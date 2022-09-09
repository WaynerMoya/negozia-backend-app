// Import the lib will be used in the middleware
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "shhh"

// this middleware will check if the user is a admin or not
// In this case the user is a admin will be used the function admin
const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');

        // if the user don't have a token, we send a message error 
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // In this case, we are using the function verify to decode the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Here, we get the user id from the token
        const user = await User.findOne({ id: decoded._id, 'tokens': token });

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // if the user is not an admin, we return an message error

        if (user.role !== 'ADMIN') {
            return res.status(401).json({
                message: 'Unauthorized the user is not admin'
            });
        }

        req.token = token;
        req.user = user;

        next();

    } catch (error) {

        // return and error with status code 500
        return res.status(500).json({
            success: false,
            message: error.message || 'Something failed'
        });
    }
}

/* This is a way to export the middleware to be used in other files. */
module.exports = auth;
