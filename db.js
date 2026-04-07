const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;

const connectToMongo = () => {
    mongoose.connect(mongoURL).then(() => {
        console.log("Connected to Mongo Successfully");
    }).catch((err) => {
        console.log("Error connecting to Mongo: ", err);
    });
}

module.exports = connectToMongo;