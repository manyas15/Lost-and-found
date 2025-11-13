const express = require('express');
const router = express.Router();

const {
  getHome, getItems, getItem,
  getReportLost, getReportFound,
  postReportLost, postReportFound
} = require('../controllers/itemController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, getHome);

router.get('/items', requireAuth, getItems);
router.get('/items/:id', requireAuth, getItem);

router.get('/report', requireAuth, getReportLost);
router.post('/report', requireAuth, postReportLost);

router.get('/found', requireAuth, getReportFound);
router.post('/found', requireAuth, postReportFound);

module.exports = router;
