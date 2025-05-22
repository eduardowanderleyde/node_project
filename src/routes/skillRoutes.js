const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// List all skills
router.get('/', skillController.index);

// Create a new skill
router.post('/', skillController.create);

// Get a single skill
router.get('/:id', skillController.show);

// Update a skill
router.put('/:id', skillController.update);

// Delete a skill
router.delete('/:id', skillController.destroy);

module.exports = router; 