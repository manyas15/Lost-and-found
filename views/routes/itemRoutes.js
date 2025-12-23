const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');

const {
  getHome, getItems, getItem,
  getReportLost, getReportFound,
  postReportLost, postReportFound
} = require('../../controllers/itemController');
const { sendEmail } = require('../../controllers/emailController');
const { requireAuth } = require('../../middleware/authMiddleware');

router.get('/', requireAuth, getHome);

router.get('/items', requireAuth, getItems);
router.get('/items/:id', requireAuth, getItem);

router.get('/report', requireAuth, getReportLost);
router.post('/report', requireAuth, (req, res, next) => {
  upload.single('itemImage')(req, res, (err) => {
    if (err) {
      return res.status(400).render('partials/layout', {
        title: 'Upload Error',
        content: `<div class="container"><h2>Image Upload Error</h2><p>${err.message}</p><a href="/report" class="btn primary">Go Back</a></div>`
      });
    }
    next();
  });
}, postReportLost);

router.get('/found', requireAuth, getReportFound);
router.post('/found', requireAuth, (req, res, next) => {
  upload.single('itemImage')(req, res, (err) => {
    if (err) {
      return res.status(400).render('partials/layout', {
        title: 'Upload Error',
        content: `<div class="container"><h2>Image Upload Error</h2><p>${err.message}</p><a href="/found" class="btn primary">Go Back</a></div>`
      });
    }
    next();
  });
}, postReportFound);

// Email route
router.post('/send-email', requireAuth, sendEmail);

module.exports = router;