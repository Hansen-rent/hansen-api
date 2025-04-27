exports.successResponse = (
  res,
  { statusCode = 200, data = {}, message = '' } = {},
) =>
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });

exports.errorResponse = (
  res,
  { statusCode = 500, message = 'Server error' } = {},
) =>
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
    },
  });
