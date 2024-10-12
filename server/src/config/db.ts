require("dotenv").config({ path: ".env" });
const mongoose = require('mongoose');

const connectToMongoDB = async() => {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to db')
    }).catch(err => {
        console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    });
}

export { connectToMongoDB }