const { readAll, addItem, getById, search } = require('../models/itemModel');

// Home: show latest items + CTA buttons
async function getHome(req, res, next) {
  try {
    const items = await readAll();
    const latest = items.slice(0, 6).map(i => ({ ...i, id: (i._id || i.id).toString() }));
    res.render('index', { title: 'Lost & Found', latest });
  } catch (err) { next(err); }
}

// List + search page
async function getItems(req, res, next) {
  try {
    const { q } = req.query;
    const items = (await search(q)).map(i => ({ ...i, id: (i._id || i.id).toString() }));
    res.render('items', { title: 'All Items', items, q: q || '' });
  } catch (err) { next(err); }
}

// Details page
async function getItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await getById(id);
    if (!item || !item.imageUrl) return res.status(404).render('partials/layout', {
      title: 'Item Not Found',
      content: `<div class="container"><h2>Item not found</h2><p>It might have been removed or doesn't have an image.</p><a href="/items" class="btn primary">Back to Items</a></div>`
    });
    const viewItem = { ...item, id: (item._id || item.id).toString() };
    res.render('item', { title: item.itemName, item: viewItem });
  } catch (err) { next(err); }
}

// Forms
function getReportLost(req, res) {
  res.render('form_lost', { title: 'Report Lost Item' });
}
function getReportFound(req, res) {
  res.render('form_found', { title: 'Report Found Item' });
}

// POST handlers
async function postReportLost(req, res, next) {
  try {
    const {
      itemName, description, location, dateLost, category,
      contactName, contactEmail, isDayScholar
    } = req.body;

    if (!itemName || !location || !dateLost || !contactEmail) {
      return res.status(400).render('partials/layout', {
        title: 'Missing Fields',
        content: `<div class="container"><h2>Missing required fields</h2><p>Please fill item name, location, date, and contact email.</p></div>`
      });
    }

    // Handle image upload - required
    if (!req.file) {
      return res.status(400).render('partials/layout', {
        title: 'Missing Image',
        content: `<div class="container"><h2>Image Required</h2><p>Please upload an image of the lost item.</p><a href="/report" class="btn primary">Go Back</a></div>`
      });
    }

    const imageUrl = '/uploads/' + req.file.filename;

    const item = {
      status: 'lost',
      itemName,
      description: description || '',
      location,
      date: dateLost,
      category: category || 'other',
      contactName: contactName || '',
      contactEmail,
      isDayScholar: Boolean(isDayScholar),
      resolved: false,
      imageUrl
    };

    await addItem(item);
    res.redirect('/items');
  } catch (err) { next(err); }
}

async function postReportFound(req, res, next) {
  try {
    const {
      itemName, description, location, dateFound, category,
      contactName, contactEmail, keeperInfo
    } = req.body;

    if (!itemName || !location || !dateFound || !contactEmail) {
      return res.status(400).render('partials/layout', {
        title: 'Missing Fields',
        content: `<div class="container"><h2>Missing required fields</h2><p>Please fill item name, location, date, and contact email.</p></div>`
      });
    }

    // Handle image upload - required
    if (!req.file) {
      return res.status(400).render('partials/layout', {
        title: 'Missing Image',
        content: `<div class="container"><h2>Image Required</h2><p>Please upload an image of the found item.</p><a href="/found" class="btn primary">Go Back</a></div>`
      });
    }

    const imageUrl = '/uploads/' + req.file.filename;

    const item = {
      status: 'found',
      itemName,
      description: description || '',
      location,
      date: dateFound,
      category: category || 'other',
      contactName: contactName || '',
      contactEmail,
      keeperInfo: keeperInfo || 'University office/staff',
      resolved: false,
      imageUrl
    };

    await addItem(item);
    res.redirect('/items');
  } catch (err) { next(err); }
}

module.exports = {
  getHome,
  getItems,
  getItem,
  getReportLost,
  getReportFound,
  postReportLost,
  postReportFound
};
