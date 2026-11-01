const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Internship title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
            trim: true,
        },
        stipend: {
            type: String,
            required: [true, 'Stipend information is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        eligibility: {
            type: String,
            required: [true, 'Eligibility criteria is required'],
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        type: {
            type: String,
            enum: ['Remote', 'Hybrid', 'In-Office'],
            default: 'Remote',
        },
        deadline: {
            type: String,
            default: 'Rolling basis',
            trim: true,
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

module.exports = mongoose.model('Internship', internshipSchema);

