const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
});

module.exports = mongoose.model('Project', ProjectSchema);
