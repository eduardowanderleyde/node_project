// Business logic layer
const Project = require('../models/projectModel');

module.exports = {
  listProjects: () => Project.findAll(),
  getProjectById: (id) => Project.findById(id),
  createProject: (data) => Project.create(data),
  updateProject: (id, data) => Project.update(id, data),
  deleteProject: (id) => Project.remove(id)
};
