const { connect } = require('mongoose');

const connectDB = async (url) => {
    try {
        await connect(url);
        console.log("Connection to database successful!");
    } catch (error) {
        console.error("Failed to connect to database", error.message);
        process.exit(1);
    }
};

module.exports = connectDB 