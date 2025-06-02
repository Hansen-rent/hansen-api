const { Router } = require('express');
const {
  registerValidator,
  loginValidator,
} = require('../validators/authValidators');
const { register, login, getMe } = require('../controllers/authController');
const { verifyJWT } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', verifyJWT, getMe);

module.exports = router;
