const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return typeof v === 'string';
      },
      message: 'Title must be a string'
    }
  },
  description: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return typeof v === 'string';
      },
      message: 'Description must be a string'
    }
  },
  technologies: [{ 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return typeof v === 'string';
      },
      message: 'Each technology must be a string'
    }
  }],
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || typeof v === 'string';
      },
      message: 'Image URL must be a string'
    }
  },
  projectUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || typeof v === 'string';
      },
      message: 'Project URL must be a string'
    }
  }
});

// Adicionar validação customizada para garantir que technologies seja um array de strings
ProjectSchema.path('technologies').validate(function(technologies) {
  return Array.isArray(technologies) && technologies.every(tech => typeof tech === 'string');
}, 'Technologies must be an array of strings');

module.exports = mongoose.model('Project', ProjectSchema);
