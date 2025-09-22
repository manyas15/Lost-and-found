const express = require('express');
const router = express.Router();

const {
  getHome, getItems, getItem,
  getReportLost, getReportFound,
  postReportLost, postReportFound
} = require('../controllers/itemController');

router.get('/', getHome);

router.get('/items', getItems);
router.get('/items/:id', getItem);

router.get('/report', getReportLost);
router.post('/report', postReportLost);

router.get('/found', getReportFound);
router.post('/found', postReportFound);

module.exports = router;
