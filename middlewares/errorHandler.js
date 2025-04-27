const errorResponse = require('../utils/response');

exports.errorHandler = (err, req, res) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  errorResponse(res, {
    statusCode,
    message,
  });
};
