const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const cache = require('../middlewares/cache');

// Cache duration in seconds
const CACHE_DURATION = 300; // 5 minutes

// List all skills
router.get('/', cache(CACHE_DURATION), skillController.index);

// Create a new skill
router.post('/', skillController.create);

// Get a single skill
router.get('/:id', cache(CACHE_DURATION), skillController.show);

// Update a skill
router.put('/:id', skillController.update);

// Delete a skill
router.delete('/:id', skillController.destroy);

module.exports = router; 