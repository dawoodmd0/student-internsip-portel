const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getApplications,
} = require('../controllers/applicationController');

// POST submit a student application
router.post('/', submitApplication);

// GET retrieve all submitted applications
router.get('/', getApplications);

module.exports = router;

