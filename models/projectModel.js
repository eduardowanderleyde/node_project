// In-memory storage for demonstration
const { v4: uuidv4 } = require('uuid');

const projects = [];

module.exports = {
  findAll: () => projects,
  findById: (id) => projects.find(p => p.id === id),
  create: (data) => {
    const newProject = { id: uuidv4(), ...data };
    projects.push(newProject);
    return newProject;
  },
  update: (id, data) => {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data };
      return projects[index];
    }
    return null;
  },
  remove: (id) => {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      return projects.splice(index, 1)[0];
    }
    return null;
  }
};
