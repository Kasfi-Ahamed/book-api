const express = require('express');
const app = express();
const booksRoute = require('./routes/books');

app.use(express.json());
app.use('/books', booksRoute);

// Metrics endpoint (for Prometheus monitoring)
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP dummy_metric Just a demo\n# TYPE dummy_metric counter\ndummy_metric 1`);
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
