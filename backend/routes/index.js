const express = require('express');
const identifyRoutes = require('./identify.js');
const searchRoutes = require('./search.js');

const router = express.Router();

// Route for image identification
router.use('/identify', identifyRoutes); // Corrected to use 'router.use'

// Route for alternatives search
router.use('/search', searchRoutes);

module.exports = router;
