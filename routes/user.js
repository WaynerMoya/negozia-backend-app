/* This is importing the express module. */
const express = require('express');

/* This is creating a new router object. */
const route = express.Router();

/* This is importing the UserController.js file. */
const UserController = require('../controllers/UserController');

const auth = require('../middleware/auth')

/* This route will be used to get all users */
route.get('/get-users', auth, UserController.getAllUsers);

/* This route will be used to get an user by email*/
route.get('/get-user-by-id/:id', auth, UserController.getUserById);

/* This route will be used to create a new user */
route.post('/create-user', auth, UserController.createUser);

/* This route will be used to update an user by email */
route.put('/update-user-by-id/:id', auth, UserController.updateUserById);

/* This route will be used to delete an user by email */
route.delete('/delete-user-by-id/:id', auth, UserController.deleteUserById)

/* This route will be used to get the profile of user by token */
route.get('/get-profile', UserController.getProfile)

/* This is exporting the route to the server.js file. */
module.exports = route;