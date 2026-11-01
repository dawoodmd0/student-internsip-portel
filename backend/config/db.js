const mongoose = require('mongoose');

/**
 * Automatically insert default internship positions if the collection is empty
 */
const initDefaultInternships = async () => {
    try {
        const Internship = require('../models/Internship');
        const { sampleInternships } = require('../controllers/internshipController');

        const count = await Internship.countDocuments();
        if (count === 0) {
            console.log('🌱 No internship records found. Automatically populating default internship data...');
            const inserted = await Internship.insertMany(sampleInternships);
            console.log(`✅ ${inserted.length} default internships populated automatically.`);
        }
    } catch (err) {
        console.warn('⚠️ Note: Could not auto-initialize default internships:', err.message);
    }
};

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

        // Automatically populate default data if database is fresh
        await initDefaultInternships();
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected.');
});

module.exports = connectDB;
