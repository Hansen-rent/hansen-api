const { Router } = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
