const Skill = require('../models/Skill');

// List all skills
exports.index = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new skill
exports.create = async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get a single skill by ID
exports.show = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.json(skill);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a skill
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validar tipos de dados
    if (updates.name && typeof updates.name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' });
    }
    if (updates.level && typeof updates.level !== 'string') {
      return res.status(400).json({ error: 'Level must be a string' });
    }
    if (updates.category && typeof updates.category !== 'string') {
      return res.status(400).json({ error: 'Category must be a string' });
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(skill);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a skill
exports.destroy = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: error.message });
  }
}; 