const express = require('express');
const router = express.Router();
const {
  renderSignup,
  renderLogin,
  signup,
  login,
  logout,
  renderOtp,
  verifyOtp
} = require('../../controllers/authController');

router.get('/signup', renderSignup);
router.post('/signup', signup);
router.get('/login', renderLogin);
router.post('/login', login);
router.post('/logout', logout);
router.get('/otp', renderOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;