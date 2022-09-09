// import the model of user
const User = require('../models/User')

// import the lib to encrypt the password
const crypto = require('crypto');


const UserController = {

    // this function will be used to CREATE A NEW USER in the database
    createUser: async (req, res) => {

        try {

            // variable to store the data from the request
            const user = new User({ ...req.body, role: 'CUSTOMER' });

            // encrypt the password
            const passwordHashed = crypto.createHash('sha256')
                .update(user.password).digest('hex');

            if (!passwordHashed) {
                return res.status(400).json({
                    success: false,
                    message: 'Password encryption failed'
                });
            }

            user.password = passwordHashed

            // saved user in the database
            await user.save()

            // if the user save failed
            // then return a error message
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User not created'
                });
            }

            // if the user save success
            // then return a success message
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone
                }
            });

        } catch (error) {

            // if the user save failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message || 'Something failed'
            });
        }

    },
    // this function will be used to GET ALL USER in the database
    getAllUsers: async (req, res) => {
        try {

            // get all user in the database
            const users = await User.find({})

            // if the user searched failed
            // then return a error message
            if (!users) {
                return res.status(404).json({
                    success: false,
                    message: users.message || 'Users was not founded'
                })
            }

            /* process only the field to return, because i don't wanna return password and tokens*/
            const result = users.map(user => ({ email: user.email, name: user.name, lastName: user.lastName, phone: user.phone, role: user.role, id: user.id }))

            // if something is ok return all users
            return res.status(200).json({
                success: true,
                message: 'Users was founded successfully',
                users: result
            })


        } catch (error) {
            // if the get all users failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    // this function will be used to DELETE A USER BY EMAIL in the database
    deleteUserById: async (req, res) => {
        try {

            const { id } = req.params

            // get and delete the user
            const user = await User.findByIdAndDelete(id)

            // validate if the user was deleted
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: user.message || 'User was not deleted'
                })
            }

            // if something is ok return a message
            return res.status(201).json({
                success: true,
                message: 'User was deleted'
            })


        } catch (error) {
            // if the delete user by email failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    // this function will be used to GET USER BY EMAIL in the database
    getUserById: async (req, res) => {
        try {

            const { id } = req.params

            // get the user in the database
            const user = await User.findById(id)

            // validate if the user was searched
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: user.message || 'User was not founded'
                })
            }

            // if something is ok return the user

            res.status(200).json({
                success: true,
                message: 'User was founded',
                user: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone
                }
            })

        } catch (error) {
            // if the get user by email failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    // this function will be used to UPDATE USER BY EMAIL in the database
    updateUserById: async (req, res) => {
        try {

            const { id } = req.params

            const { name, lastName, phone, password } = req.body

            /* get user by email and update */
            const user = await User.findByIdAndUpdate(id, {
                name,
                lastName,
                phone
            })

            /* create a password encrypt */
            const passwordHashed = crypto.createHash('sha256')
                .update(password).digest('hex');

            /* update the password */
            user.password = passwordHashed

            /* save the password */
            await user.save()

            // if the user was not founded and updated return an error
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: user.message || 'User was not updated'
                })
            }

            // if something is ok return message
            res.status(201).json({
                success: true,
                message: 'User was updated',
                user: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone
                }
            })

        } catch (error) {
            // if the update user by email failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    // this function will be used to get profile by token
    getProfile: async (req, res) => {
        try {

            const token = req.header('Authorization').replace('Bearer ', '');

            const user = await User.findOne({ tokens: token })

            // if the user was not founded return an error
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: user.message || 'User was not updated'
                })
            }

            // if something is ok return message
            res.status(201).json({
                success: true,
                message: 'User profile was founded',
                user: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role
                }
            })

        } catch (error) {
            // if the update user by email failed
            // then return a error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}



module.exports = UserController;