const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

// Генерация токена
const generateToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return errorResponse(res, {
      statusCode: 400,
      message: 'User already exists',
    });
  }

  const user = await User.create({ email, password });

  successResponse(res, {
    statusCode: 201,
    data: {
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    },
    message: 'User registered successfully',
  });
});

// @desc    Логин пользователя
// @route   POST /api/auth/login
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    successResponse(res, {
      data: {
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Invalid email or password',
    });
  }
});

// @desc    Получение данных пользователя по токену
// @route   GET /api/auth/me
const getMe = catchAsync(async (req, res) => {
  // const user = await User.findById(req.user.id).select('-password');
  const user = await User.findById(req.query.user).select('-password');
  successResponse(res, { data: user });
});

module.exports = {
  register,
  login,
  getMe,
};
