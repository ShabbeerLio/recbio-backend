const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://digitaldizire25:dD0II9uU00aw753S@rackkon.ojxkg.mongodb.net/Rackkon?retryWrites=true&w=majority&appName=Rackkon"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully ");
    })
}

module.exports = connectToMongo;