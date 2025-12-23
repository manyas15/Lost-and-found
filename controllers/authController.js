const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn('SMTP not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS');
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass }
  });
}

async function sendOtpMail(to, code) {
  const transporter = createTransport();
  const from = process.env.SMTP_USER || 'no-reply@example.com';
  const appName = 'Lost & Found';
  const subject = `${appName} Verification Code`;
  const text = `Your ${appName} verification code is: ${code}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>${appName} Verification</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
    </div>
  `;
  try {
    await transporter.sendMail({ from, to, subject, text, html });
  } catch (e) {
    // In development, fall back to console logging so flow can continue
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Email send failed, logging OTP to console for dev:', e.message);
      console.warn(`OTP for ${to}: ${code}`);
      return;
    }
    console.error('Failed to send OTP email:', e);
    throw new Error('Email send failed');
  }
}

async function startOtpFlow(user) {
  const code = generateOtp();
  user.otpCode = code;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();
  await sendOtpMail(user.email, code);
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function resolveRedirect(nextUrl) {
  if (!nextUrl || typeof nextUrl !== 'string') return '/';
  if (nextUrl.startsWith('/') && !nextUrl.startsWith('//')) return nextUrl;
  return '/';
}

function renderSignup(req, res) {
  if (req.user) {
    return res.redirect(resolveRedirect(req.query.next));
  }
  res.render('auth_signup', {
    title: 'Create Account',
    error: null,
    form: {},
    next: req.query.next || ''
  });
}

function renderLogin(req, res) {
  if (req.user) {
    return res.redirect(resolveRedirect(req.query.next));
  }
  res.render('auth_login', {
    title: 'Login',
    error: null,
    form: {},
    next: req.query.next || ''
  });
}

async function signup(req, res) {
  const { name, email, password, confirmPassword, next: nextUrl } = req.body;
  if (!name || !email || !password) {
    return res.status(400).render('auth_signup', {
      title: 'Create Account',
      error: 'Please fill in name, email, and password.',
      form: { name, email },
      next: nextUrl || ''
    });
  }
  if (password.length < 6) {
    return res.status(400).render('auth_signup', {
      title: 'Create Account',
      error: 'Password must be at least 6 characters.',
      form: { name, email },
      next: nextUrl || ''
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).render('auth_signup', {
      title: 'Create Account',
      error: 'Passwords do not match.',
      form: { name, email },
      next: nextUrl || ''
    });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).render('auth_signup', {
        title: 'Create Account',
        error: 'An account with that email already exists.',
        form: { name, email },
        next: nextUrl || ''
      });
    }

    const user = await User.create({ name, email, password, isVerified: false });
    await startOtpFlow(user);
    return res.render('auth_otp', {
      title: 'Verify Your Email',
      error: null,
      form: { email },
      next: nextUrl || '',
      info: 'We sent a 6-digit code to your email. Enter it below.'
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).render('auth_signup', {
      title: 'Create Account',
      error: 'Something went wrong. Please try again.',
      form: { name, email },
      next: nextUrl || ''
    });
  }
}

async function login(req, res) {
  const { email, password, next: nextUrl } = req.body;
  if (!email || !password) {
    return res.status(400).render('auth_login', {
      title: 'Login',
      error: 'Please provide email and password.',
      form: { email },
      next: nextUrl || ''
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).render('auth_login', {
        title: 'Login',
        error: 'Invalid credentials.',
        form: { email },
        next: nextUrl || ''
      });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).render('auth_login', {
        title: 'Login',
        error: 'Invalid credentials.',
        form: { email },
        next: nextUrl || ''
      });
    }
    await startOtpFlow(user);
    return res.render('auth_otp', {
      title: 'Verify Login',
      error: null,
      form: { email },
      next: nextUrl || '',
      info: 'Enter the 6-digit code sent to your email to finish login.'
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).render('auth_login', {
      title: 'Login',
      error: 'Something went wrong. Please try again.',
      form: { email },
      next: nextUrl || ''
    });
  }
}

function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/');
}

async function renderOtp(req, res) {
  const { email, next: nextUrl } = req.query;
  return res.render('auth_otp', {
    title: 'Verify Code',
    error: null,
    form: { email },
    next: nextUrl || '',
    info: 'We sent a 6-digit code to your email.'
  });
}

async function verifyOtp(req, res) {
  const { email, code, next: nextUrl } = req.body;
  if (!email || !code) {
    return res.status(400).render('auth_otp', {
      title: 'Verify Code',
      error: 'Please enter the code sent to your email.',
      form: { email },
      next: nextUrl || ''
    });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(400).render('auth_otp', {
        title: 'Verify Code',
        error: 'No active verification for this email. Please login or signup again.',
        form: { email },
        next: nextUrl || ''
      });
    }
    const now = new Date();
    if (now > user.otpExpires || code !== user.otpCode) {
      return res.status(400).render('auth_otp', {
        title: 'Verify Code',
        error: 'Invalid or expired code. Please try again.',
        form: { email },
        next: nextUrl || ''
      });
    }
    // Clear OTP, mark verified, sign in
    user.otpCode = null;
    user.otpExpires = null;
    if (!user.isVerified) user.isVerified = true;
    await user.save();

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.redirect(resolveRedirect(nextUrl));
  } catch (e) {
    console.error('OTP verify error', e);
    return res.status(500).render('auth_otp', {
      title: 'Verify Code',
      error: 'Something went wrong. Please try again.',
      form: { email },
      next: nextUrl || ''
    });
  }
}

module.exports = {
  renderSignup,
  renderLogin,
  signup,
  login,
  logout,
  renderOtp,
  verifyOtp
};

