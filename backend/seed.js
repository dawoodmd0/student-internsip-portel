const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const { sampleInternships } = require('./controllers/internshipController');

// Load environment variables reliably from backend/.env and root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI is missing in backend/.env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected! Resetting internships collection...');

        await Internship.deleteMany({});
        const inserted = await Internship.insertMany(sampleInternships);

        console.log(`✅ Successfully seeded ${inserted.length} sample internships!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during database seed:', error);
        process.exit(1);
    }
};

seedData();
