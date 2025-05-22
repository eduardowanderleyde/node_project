// src/controllers/projectController.js

const Project = require('../models/Project');

// List all projects
exports.index = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new project
exports.create = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get a single project by ID
exports.show = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a project
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validar tipos de dados
    if (updates.title && typeof updates.title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }
    if (updates.description && typeof updates.description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string' });
    }
    if (updates.technologies && !Array.isArray(updates.technologies)) {
      return res.status(400).json({ error: 'Technologies must be an array' });
    }
    if (updates.imageUrl && typeof updates.imageUrl !== 'string') {
      return res.status(400).json({ error: 'Image URL must be a string' });
    }
    if (updates.projectUrl && typeof updates.projectUrl !== 'string') {
      return res.status(400).json({ error: 'Project URL must be a string' });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(project);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a project
exports.destroy = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};
