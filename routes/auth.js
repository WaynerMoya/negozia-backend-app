/* This is importing the express module. */
const express = require('express');

/* This is creating a new router object. */
const route = express.Router();

/* This is importing the AuthController.js file. */
const AuthController = require('../controllers/AuthController');

/* This route will be used to login user */
route.post('/login', AuthController.login);

/* This route will be used to logout user*/
route.get('/logout', AuthController.logout);


/* This is exporting the route to the server.js file. */
module.exports = route;