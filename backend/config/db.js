const mongoose = require('mongoose');

/**
 * Connect to MongoDB using connection string from environment variable
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error('❌ Error: MONGO_URI is not defined in environment variables.');
            console.warn('⚠️ Please set MONGO_URI in your backend/.env file.');
            return;
        }

        const conn = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do not crash the entire process so that health endpoints can still report status
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected.');
});

module.exports = connectDB;

