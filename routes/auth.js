const db = require('./db');

function ensureUser(req, res, next) {
  if (req.session.userId) return next();

  if (!req.session.guestId) {
    req.session.guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Optional: insert guest into users table (skip if unnecessary)
    db.run(`INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, '')`, 
      [req.session.guestId, req.session.guestId], 
      err => {
        if (err) console.error('Guest creation error:', err.message);
      }
    );
  }

  next();
}

function getUserId(req) {
  return req.session.userId || req.session.guestId;
}

module.exports = { ensureUser, getUserId };
