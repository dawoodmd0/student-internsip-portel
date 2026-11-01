const express = require('express');
const router = express.Router();
const {
    getInternships,
    getInternshipById,
    seedInternships,
} = require('../controllers/internshipController');

// GET all internships / search
router.get('/', getInternships);

// POST manual seed (useful for testing and initial cloud setup)
router.post('/seed', seedInternships);

// GET single internship by ID
router.get('/:id', getInternshipById);

module.exports = router;

