const fs = require('fs');
const express = require('express');
const app = express();
const booksRoute = require('./routes/books');

// ✅ Log startup timestamp to a file
const logMessage = `App started at ${new Date().toISOString()}\n`;
fs.writeFileSync('startup.log', logMessage);

// Middleware
app.use(express.json());

// Routes
app.use('/books', booksRoute);

// ✅ Healthcheck endpoint (for uptime monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// ✅ Metrics endpoint (for Prometheus monitoring)
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send([
    '# HELP dummy_metric This is a static test metric for demo purposes',
    '# TYPE dummy_metric counter',
    'dummy_metric{label="demo"} 1'
  ].join('\n'));
});

// Start server if not in test mode
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
