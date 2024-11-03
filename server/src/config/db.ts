const mongoose = require('mongoose');

const connectToMongo = async() => {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to mongo')
    }).catch(err => {
        console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    });
}

export { connectToMongo }