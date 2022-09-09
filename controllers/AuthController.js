// import the model User
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || "shhh"

// import this lib to create tokens
const jwt = require('jsonwebtoken')

// import the lib to encrypt the password
const crypto = require('crypto');


/**
 * Given a user's password and a hash of that password, 
 * check if the password matches the hash
 * @param userPassword - The password that the user has entered.
 * @param hash - The hash that you want to compare to the password.
 * @returns A boolean value.
 */
const isPasswordMatched = async (userPassword, hash) => {
    try {

        const myPasswordHashed = await crypto.createHash('sha256').update(userPassword).digest('hex');
        if (myPasswordHashed === hash) {
            return true;
        }

    } catch (error) {
        console.log(error)
    }

    return false;
}


const AuthController = {
    // this function will be used for user can login
    login: async (req, res) => {
        try {

            // get the email and password 
            const { email, password } = req.body;

            // validate the email and password
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'email and password are required'
                });
            }

            // search the user in the database
            const user = await User.findOne({ email });

            // if the user not found return a error message
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                })
            }

            // compare the password with the password encrypted in the database
            const pass = await isPasswordMatched(password, user.password);

            // if the password is not matched  return a error message
            if (!pass) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid Password',
                });
            }

            // create token for the user
            const token = await jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET);

            // create the response without the password
            const response = {
                id: user._id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                token: token
            }

            // add the token in the array tokens
            user.tokens.push(token);

            // finally saved the new token 
            await user.save();

            // return data with token
            return res.status(201).json({
                success: true,
                message: 'User logged in successfully',
                response
            });

        } catch (error) {
            // if the function failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: "Error in the login process",
                error: error
            })
        }
    },
    // this function will be used for the user can logout
    logout: async (req, res) => {

        try {

            /* get token */
            const token = req.header('Authorization').replace('Bearer ', '');

            /* get user by token */
            const user = await User.findOne({ tokens: token })

            // delete the token the user has been used
            user.tokens = Object.values(user.tokens).filter(tokenItem => tokenItem !== token)

            // save the current tokens
            await user.save()

            // validate if the user was searched
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: user.message || 'User was not logged out'
                })
            }

            // if something is ok return the user and message
            res.status(201).json({
                success: true,
                message: 'The user has logged out',
                user
            })


        } catch (error) {
            // if the function failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: "Error in the login process",
                error: error
            })
        }

    }
}

module.exports = AuthController;