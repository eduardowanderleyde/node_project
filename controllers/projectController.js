// HTTP logic, interacting with request/response
const service = require('../services/projectService');

module.exports = {
  index: (req, res) => {
    const projects = service.listProjects();
    res.json({ projects });
  },

  show: (req, res) => {
    const project = service.getProjectById(req.params.id);
    return project
      ? res.json(project)
      : res.status(404).json({ error: 'Project not found' });
  },

  create: (req, res) => {
    const newProject = service.createProject(req.body);
    res.status(201).json(newProject);
  },

  update: (req, res) => {
    const updated = service.updateProject(req.params.id, req.body);
    return updated
      ? res.json(updated)
      : res.status(404).json({ error: 'Project not found' });
  },

  remove: (req, res) => {
    const removed = service.deleteProject(req.params.id);
    return removed
      ? res.json(removed)
      : res.status(404).json({ error: 'Project not found' });
  }
};
