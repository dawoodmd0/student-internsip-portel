const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please enter a valid email address',
            ],
        },
        rollNumber: {
            type: String,
            required: [true, 'Roll number is required'],
            trim: true,
        },
        internshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Internship',
            required: [true, 'Internship ID is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Optional index to prevent duplicate applications for the same internship by rollNumber
applicationSchema.index({ internshipId: 1, rollNumber: 1 });

module.exports = mongoose.model('Application', applicationSchema);

