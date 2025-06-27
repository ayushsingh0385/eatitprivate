const express = require('express');
const { searchAlternatives } = require('../controllers/searchController.js');

const router = express.Router();

// GET /api/search
router.get('/', searchAlternatives);

module.exports = router;
