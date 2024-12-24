const mongoose = require('mongoose');

// Disable strict query mode
mongoose.set('strictQuery', false);

// MongoDB URI
const mongoURI = "mongodb+srv://digitaldizire25:dD0II9uU00aw753S@rackkon.ojxkg.mongodb.net/Rackkon?retryWrites=true&w=majority&appName=Rackkon";

// Updated connectToMongo function using async/await
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = connectToMongo;