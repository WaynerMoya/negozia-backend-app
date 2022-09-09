/****************************************************************************************** */
/****************************************************************************************** */
/******************************* DECLARE LIBRARY AND MODULES ****************************** */
/****************************************************************************************** */
/****************************************************************************************** */

/* Importing the cors module.  */
const cors = require("cors")

/* Importing the express module. */
const express = require('express')

/* Setting the port to the environment variable PORT or 3001 
if the environment variable is not set. */
const port = process.env.PORT || 8080;

/* import the database */
require('./database/db')

/* Setting the environment variable to the value of the environment 
variable NODE_ENV or 'local' if the environment variable NODE_ENV is not set. */
const environment = process.env.NODE_ENV || 'local'

/****************************************************************************************** */
/****************************************************************************************** */
/************************************* IMPORT ROUTES ************************************** */
/****************************************************************************************** */
/****************************************************************************************** */


/* Importing the file `routes/user.js` and assigning it to the variable `user`. */
const user = require('./routes/user')

const auth = require('./routes/auth')

/****************************************************************************************** */
/****************************************************************************************** */
/**************************************** START CODE ************************************** */
/****************************************************************************************** */
/****************************************************************************************** */

/* Creating an instance of the express module. */
const app = express()


/* This is a whitelist of domains that are allowed to make requests to the server. */
const whitelist = [
    "http://localhost:3000",
    "http://negozia-web-app.s3-website-us-east-1.amazonaws.com",
    "http://negozia-web-app.s3-website-us-east-1.amazonaws.com/*",
    "http://negozia-web-app.s3-website-us-east-1.amazonaws.com/**"
]

/* This is a whitelist of domains that are allowed to make requests to the server. */
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

/* This is a whitelist of domains that are allowed to make requests to the server. */
app.use(cors(corsOptions))

app.use(express.json())

/* This is setting the limit of the size of the request body to 200mb. */
app.use(express.json({
    limit: '200mb',
    extended: true,
    parameterLimit: 100000
}));

app.use(express.urlencoded({
    limit: '200mb',
    extended: true,
    parameterLimit: 100000
}));

app.use(express.text({ limit: '200mb' }));

/****************************************************************************************** */
/****************************************************************************************** */
/****************************************** ROUTES **************************************** */
/****************************************************************************************** */
/****************************************************************************************** */

/* Telling the server to use the routes in the file `routes/user.js` when the path starts with `/user`. */
app.use('/user', user)

app.use('/auth', auth)

/****************************************************************************************** */
/****************************************************************************************** */
/***************************************** LISTENER *************************************** */
/****************************************************************************************** */
/****************************************************************************************** */

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'OK'
    })
})

/* Telling the server to listen for requests on the port specified by the variable `port`. */
app.listen(port, () => {

    /* Using a template literal to print the value of the variable `port` to the console. */
    console.log(`Server is running on port ${port}`)

    /* Using a template literal to print the value of the variable `environment` to the console. */
    console.log(`Environment: ${environment}`)
})