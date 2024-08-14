const connect = require('mongoose');

const connectDB = async (url) => {
    await connect(url);
    console.log("Connection to database successful!");
}

module.exports = { connectDB }