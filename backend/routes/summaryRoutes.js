const express = require('express');
const router = express.Router();
const {
  summarizeFromURL,
  getAllSummaries,
  deleteSummary,
  updateSummary,
} = require('../controllers/summaryController');

// @route   POST /api/summary/url
// @desc    Process a meeting recording from a URL and get summary
// @access  Public
router.post('/url', summarizeFromURL);

// GET route for fetching all summaries
router.get('/', getAllSummaries);

// PUT route to update a summary by ID
router.put('/:id', updateSummary);

// DELETE route to delete a summary by ID
router.delete('/:id', deleteSummary);

module.exports = router;

