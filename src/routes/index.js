const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');

// Define Skill schema and model only if not already defined
const SkillSchema = new mongoose.Schema({
  name: String,
  level: String
});
const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

// Main welcome route
router.get('/', (req, res) => {
    res.send('API Portfolio is running');
});

// Health check route
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Projects route - returns all projects from the database
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Skills route - returns all skills from the database
router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

module.exports = router;
