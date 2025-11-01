const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB database');
        })
        await mongoose.connect(process.env.MONGODB);
       
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
module.exports = connectDB;