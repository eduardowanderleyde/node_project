const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  category: { type: String }
});

// Evita redefinição do modelo
module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema); 