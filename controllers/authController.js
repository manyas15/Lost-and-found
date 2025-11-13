const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/authMiddleware');

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

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(resolveRedirect(nextUrl));
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
    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(resolveRedirect(nextUrl));
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

module.exports = {
  renderSignup,
  renderLogin,
  signup,
  login,
  logout
};

