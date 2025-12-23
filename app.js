require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { attachUser } = require('./middleware/authMiddleware');
const app = express();

// Serve static files from the "public" folder
app.use(express.static('public'));
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View engine: EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lost_found';
mongoose.connect(MONGO_URI).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
const itemRoutes = require('./views/routes/itemRoutes');
const authRoutes = require('./views/routes/authRoutes');
app.use('/', itemRoutes);
app.use('/auth', authRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('partials/layout', {
    title: 'Page Not Found',
    content: `
      <section class="container text-center" style="padding: 4rem 0;">
        <div style="font-size: 6rem; margin-bottom: 1rem;">🔍</div>
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary);">Page Not Found</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/" class="btn primary">🏠 Go Home</a>
          <a href="/items" class="btn secondary">📋 Browse Items</a>
          <a href="/report" class="btn secondary">📝 Report Lost Item</a>
        </div>
      </section>
    `
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).render('partials/layout', {
    title: 'Server Error',
    content: `
      <section class="container text-center" style="padding: 4rem 0;">
        <div style="font-size: 6rem; margin-bottom: 1rem;">⚠️</div>
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--danger);">Oops! Something Went Wrong</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
          We're experiencing some technical difficulties. Please try again in a few moments.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/" class="btn primary">🏠 Go Home</a>
          <a href="/items" class="btn secondary">📋 Browse Items</a>
          <button onclick="window.location.reload()" class="btn secondary">🔄 Try Again</button>
        </div>
        ${process.env.NODE_ENV === 'development' ? `
          <details style="margin-top: 2rem; text-align: left; max-width: 800px; margin-left: auto; margin-right: auto;">
            <summary style="cursor: pointer; font-weight: bold; color: var(--text-secondary);">Development Error Details</summary>
            <pre style="background: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-top: 1rem; color: var(--text-primary);">${(err && err.stack) || 'Unknown error'}</pre>
          </details>
        ` : ''}
      </section>
    `
  });
});

// Basic process-level error logging (demo)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Lost & Found running at http://localhost:${PORT}`);
});