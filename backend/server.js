require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((v) => v.trim()) : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

const path = require('path');
app.use('/admin', express.static(path.join(__dirname, '..', 'admin'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '..', 'storefront'), { extensions: ['html'] }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'storefront', 'index.html')));
app.get('/api/health', (_req, res) => {
  const database = require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(database === 'connected' ? 200 : 503).json({
    status: database === 'connected' ? 'ok' : 'degraded',
    database,
  });
});

// Avoid Mongoose buffering requests for ten seconds when the configured remote database is unavailable.
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || require('mongoose').connection.readyState === 1) return next();
  return res.status(503).json({
    message: 'Database is unavailable. Check the configured MONGO_URI and MongoDB network access.',
    code: 'DATABASE_UNAVAILABLE',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/media', require('./routes/media'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

if (require.main === module) {
  connectDB()
    .catch((error) => console.error(`[startup] Database unavailable: ${error.message}`))
    .finally(() => app.listen(port, () => console.log(`Commerce server listening on port ${port}`)));
}

module.exports = app;
      
