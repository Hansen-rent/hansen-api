const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const verifyJWT = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      [, token] = req.headers.authorization.split(' ');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, {
        statusCode: 401,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    errorResponse(res, {
      statusCode: 401,
      message: 'Not authorized, no token',
    });
  }
};

module.exports = { verifyJWT };
