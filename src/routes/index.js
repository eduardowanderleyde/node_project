const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const projectRoutes = require('./projectRoutes');
const skillRoutes = require('./skillRoutes');
const authRoutes = require('./authRoutes');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

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

// Auth routes (não precisam de autenticação)
router.use('/auth', authRoutes);

// Rotas protegidas que precisam de autenticação
router.use('/projects', auth, projectRoutes);
router.use('/skills', auth, skillRoutes);

// Rotas de admin (precisam de autenticação e role admin)
router.get('/admin/projects', auth, adminAuth, async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/skills', auth, adminAuth, async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
