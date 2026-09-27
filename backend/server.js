require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ecom-api', timestamp: new Date().toISOString() }));
app.use('/api/products', require('./routes/products'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
async function start() {
  if (process.env.MONGO_URI) await connectDB();
  else console.warn('MONGO_URI is not configured; API started without database connection.');
  app.listen(PORT, () => console.log(`Ecom API running on http://localhost:${PORT}`));
}
start();

module.exports = app;
