const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ message: 'Validation failed', errors: Object.values(error.errors).map((item) => item.message) });
  if (error.code === 11000) return res.status(409).json({ message: `Duplicate value for ${Object.keys(error.keyValue).join(', ')}` });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid resource id' });
  res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
};

module.exports = errorHandler;
      
