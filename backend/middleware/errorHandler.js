module.exports = (error, req, res, next) => {
  console.error(`[api] ${req.method} ${req.originalUrl}`, error.message);
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(', ') });
  if (error.code === 11000) return res.status(409).json({ message: `Already exists: ${Object.keys(error.keyPattern || {}).join(', ')}` });
  res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
};
