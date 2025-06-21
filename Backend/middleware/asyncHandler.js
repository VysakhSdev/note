const asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Error:', error);
  
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Something went wrong';
  
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      });
    }
  };

  export default asyncHandler
