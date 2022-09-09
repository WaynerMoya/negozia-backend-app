/* Importing the mongoose module. */
const mongoose = require('mongoose');

/* A way to set the name of the database. */
const MONGODB_PASS = process.env.MONGODB_PASS;

/* Connecting to the database. */
mongoose.connect(`mongodb+srv://taskapp:${MONGODB_PASS}@cluster1.gqkmsqa.mongodb.net/negozia`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});