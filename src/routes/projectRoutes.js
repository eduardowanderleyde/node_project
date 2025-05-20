const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController'); // 1 nível só
const auth = require('../middlewares/auth');

// RESTful routes for projects
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Rota protegida
router.get('/secure/test', auth, (req, res) => {
  res.json({ message: `Authenticated user ${req.user.userId}` });
});

module.exports = router;
