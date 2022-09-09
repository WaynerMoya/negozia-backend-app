// import the mongoose module
const mongoose = require('mongoose')

// In the part , we invoke function Schema to create a new schema
const Schema = mongoose.Schema

// create a new schema for the user
const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    tokens: [
        {
            type: String,
            require: false
        }
    ]

}, {
    // In this part we create a new option to the schema
    // This option save the time when the user was created
    timestamps: true
})

// In the part , we create a new schema for the user
// And export the schema to use it in other files
module.exports = mongoose.model('User', UserSchema)
