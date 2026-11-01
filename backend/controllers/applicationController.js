const mongoose = require('mongoose');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

/**
 * @desc   Submit a student application for an internship
 * @route  POST /api/applications
 * @access Public
 */
const submitApplication = async (req, res) => {
    try {
        const { studentName, email, rollNumber, internshipId } = req.body;

        // 1. Validation: check presence of all required fields
        if (!studentName || !email || !rollNumber || !internshipId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: studentName, email, rollNumber, internshipId',
            });
        }

        // 2. Validate studentName and rollNumber are non-empty strings
        const trimmedName = String(studentName).trim();
        const trimmedRoll = String(rollNumber).trim();
        const trimmedEmail = String(email).trim().toLowerCase();

        if (trimmedName.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Student name must be at least 2 characters long',
            });
        }

        if (trimmedRoll.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Roll number cannot be empty',
            });
        }

        // 3. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address (e.g., student@university.edu)',
            });
        }

        // 4. Validate internshipId format
        if (!mongoose.Types.ObjectId.isValid(internshipId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid internship ID format',
            });
        }

        // 5. Verify the internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'The selected internship does not exist or has expired',
            });
        }

        // 6. Check for duplicate application (same rollNumber & same internship)
        const existingApplication = await Application.findOne({
            internshipId,
            $or: [{ rollNumber: trimmedRoll }, { email: trimmedEmail }],
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: `An application with roll number '${trimmedRoll}' or email '${trimmedEmail}' has already been submitted for this internship.`,
            });
        }

        // 7. Create application record
        const application = await Application.create({
            studentName: trimmedName,
            email: trimmedEmail,
            rollNumber: trimmedRoll,
            internshipId,
        });

        // Populate internship details for the response
        await application.populate('internshipId', 'title company location stipend');

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully! Our team will review your application soon.',
            data: application,
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while submitting application',
            error: error.message,
        });
    }
};

/**
 * @desc   Retrieve all submitted applications
 * @route  GET /api/applications
 * @access Public (for viewing / administrative demo)
 */
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('internshipId', 'title company location stipend duration')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching applications',
            error: error.message,
        });
    }
};

module.exports = {
    submitApplication,
    getApplications,
};

