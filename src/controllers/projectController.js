// src/controllers/projectController.js

const Project = require('../models/Project');

// List all projects
exports.index = async (req, res) => {
  const projects = await Project.find();
  res.json({ projects });
};

// Create a new project
exports.create = async (req, res) => {
  const newProject = await Project.create(req.body);
  res.status(201).json(newProject);
};

// Get a single project by ID
exports.show = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
};

// Update a project
exports.update = async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
};

// Delete a project
exports.remove = async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
};
