require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : true;

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ecom-api', timestamp: new Date().toISOString() }));
app.use('/api/products', require('./routes/products'));
app.use((req, res) => res.status(404).json({ message: 'Route not found', path: req.originalUrl }));
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
async function start() {
  if (process.env.MONGO_URI) await connectDB();
  else console.warn('MONGO_URI is not configured; API started without database connection.');
  app.listen(PORT, () => console.log(`Ecom API running on http://localhost:${PORT}`));
}

if (require.main === module) start().catch((error) => {
  console.error('Unable to start API:', error);
  process.exit(1);
});

module.exports = app;
