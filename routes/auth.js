const express = require('express');
const router = express.Router();
const passport = require('passport');

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

// Simple success page
router.get('/success', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.json({ message: 'Logged in successfully', user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;