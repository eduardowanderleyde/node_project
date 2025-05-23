const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const cache = require('../middlewares/cache');

// Cache duration in seconds
const CACHE_DURATION = 300; // 5 minutes

// RESTful routes for projects
router.get('/', cache(CACHE_DURATION), controller.index);
router.get('/:id', cache(CACHE_DURATION), controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

// Test Route
router.get('/secure/test', auth, (req, res) => {
  res.json({ message: `Authenticated user ${req.user.userId}` });
});

module.exports = router;
