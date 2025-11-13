const express = require('express');
const router = express.Router();
const {
  renderSignup,
  renderLogin,
  signup,
  login,
  logout
} = require('../controllers/authController');

router.get('/signup', renderSignup);
router.post('/signup', signup);
router.get('/login', renderLogin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

