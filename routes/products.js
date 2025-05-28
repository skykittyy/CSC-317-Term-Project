const express = require('express');
const router = express.Router();
const db = require('../db');  // Import your shared DB connection

// GET /api/products
router.get('/', (req, res) => {
  db.all(`SELECT id, name, price, description, image FROM products`, [], (err, rows) => {
    if (err) {
      console.error('Failed to fetch products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT id, name, price, description, image FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Failed to fetch product:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

module.exports = router;
