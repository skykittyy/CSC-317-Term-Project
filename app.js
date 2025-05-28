const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');  // Your SQLite DB connection

const app = express();
const PORT = 3000;

// Middleware: parse incoming JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key',  // use a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // set true if HTTPS
}));

// Assign a guestId if user is not logged in
app.use((req, res, next) => {
  if (!req.session.userId) {
    if (!req.session.guestId) {
      req.session.guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
    }
    req.session.isGuest = true;
  } else {
    req.session.isGuest = false;
  }
  next();
});

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve navbar partial HTML from views folder
app.get('/navbar', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'navbar.html'));
});

// Serve main HTML views
const viewsDir = path.join(__dirname, 'views');
const htmlFiles = ['index', 'about', 'faq', 'login', 'register', 'products', 'product', 'cart', 'account-exists', 'registration-success'];

htmlFiles.forEach(page => {
  app.get(`/${page === 'index' ? '' : page}`, (req, res) => {
    res.sendFile(path.join(viewsDir, `${page}.html`));
  });
});

// Serve checkout.html page
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(viewsDir, 'checkout.html'));
});

// **ADDED: Serve thankyou.html on /thankyou path**
app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(viewsDir, 'thankyou.html'));
});

// Redirect /help to /faq
app.get('/help', (req, res) => res.redirect('/faq'));

// Helper function to get current user ID (user or guest)
function getCurrentUserId(req) {
  return req.session.userId || req.session.guestId;
}

// API endpoints
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) return res.status(500).json({ error: 'Failed to load products.' });
    res.json(products);
  });
});

app.get('/api/products/:id', (req, res) => {
  let { id } = req.params;
  // Extract numeric ID if URL contains slug after slash
  id = id.split('/')[0];

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Failed to load product.' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
});

// Cart API - get cart items with product info
app.get('/api/cart', (req, res) => {
  const userId = getCurrentUserId(req);
  const sql = `
    SELECT ci.product_id AS id, p.name, p.price, p.image, ci.quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load cart.' });
    res.json(rows);
  });
});

// Add/update cart items
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = getCurrentUserId(req);

  const qty = parseInt(quantity, 10);
  if (!productId || isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Invalid product ID or quantity.' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) return res.status(400).json({ error: 'Invalid product ID' });

    db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err, cartItem) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (cartItem) {
        const newQuantity = cartItem.quantity + qty;
        db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, cartItem.id], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update cart' });

          const sql = `
            SELECT ci.product_id AS id, p.name, p.price, p.image, ci.quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
          `;
          db.all(sql, [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Failed to load cart.' });
            res.json({ success: true, cart: rows });
          });
        });
      } else {
        db.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, qty], function(err) {
          if (err) return res.status(500).json({ error: 'Failed to add to cart' });

          const sql = `
            SELECT ci.product_id AS id, p.name, p.price, p.image, ci.quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
          `;
          db.all(sql, [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Failed to load cart.' });
            res.json({ success: true, cart: rows });
          });
        });
      }
    });
  });
});

// Remove product from cart
app.post('/api/cart/remove', (req, res) => {
  const { productId } = req.body;
  const userId = getCurrentUserId(req);

  if (!productId) return res.status(400).json({ error: 'Invalid product ID.' });

  db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to remove from cart' });
    res.json({ success: true });
  });
});

// Update product quantity in cart (set specific quantity)
app.post('/api/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = getCurrentUserId(req);

  const qty = parseInt(quantity, 10);
  if (!productId || isNaN(qty) || qty < 1) {
    return res.status(400).json({ error: 'Invalid product ID or quantity.' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) return res.status(400).json({ error: 'Invalid product ID.' });

    db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err, cartItem) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (cartItem) {
        db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [qty, cartItem.id], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update cart.' });
          res.json({ success: true });
        });
      } else {
        db.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, qty], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to add to cart.' });
          res.json({ success: true });
        });
      }
    });
  });
});

// Clear cart items for current user (after checkout)
app.post('/api/cart/clear', (req, res) => {
  const userId = getCurrentUserId(req);

  console.log(`Clearing cart for user: ${userId}`);

  db.run('DELETE FROM cart_items WHERE user_id = ?', [userId], function(err) {
    if (err) {
      console.error('Failed to clear cart:', err);
      return res.status(500).json({ error: 'Failed to clear cart.' });
    }
    console.log('Cart cleared successfully');
    res.json({ success: true });
  });
});

// Authentication endpoints
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error.' });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

    req.session.userId = user.id;
    req.session.isGuest = false;
    delete req.session.guestId;
    res.json({ success: true });
  });
});

app.post('/register', (req, res) => {
  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'Please fill all fields.' });
  }

  db.run(
    'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)',
    [name, email, username, password],
    err => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Account with that email or username already exists.' });
        }
        return res.status(500).json({ error: 'Server error.' });
      }
      res.json({ message: 'User registered successfully', username });
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect('/');
  });
});

// Check session status API
app.get('/check-session', (req, res) => {
  res.json({
    userId: req.session.userId,
    isGuest: req.session.isGuest || false
  });
});

// === NEW: Order details API for thankyou.html ===
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  const orderSql = `SELECT id, customer_name as customerName, shipping_cost as shippingCost, taxes, total
                    FROM orders WHERE id = ?`;

  db.get(orderSql, [orderId], (err, order) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load order' });
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsSql = `
      SELECT oi.product_id as id, p.name, p.description, p.image, oi.price, oi.quantity
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.all(itemsSql, [orderId], (err, items) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to load order items' });
      }

      res.json({
        customerName: order.customerName,
        shippingCost: order.shippingCost,
        taxes: order.taxes,
        total: order.total,
        items: items || []
      });
    });
  });
});

// Catch-all for unknown /api routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
