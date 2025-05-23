const express = require('express');
const router = express.Router();

let books = [{ id: 1, title: '1984', author: 'George Orwell' }];

router.get('/', (req, res) => {
  res.json(books);
});

router.post('/', (req, res) => {
  const book = { id: books.length + 1, ...req.body };
  books.push(book);
  res.status(201).json(book);
});

module.exports = router;
