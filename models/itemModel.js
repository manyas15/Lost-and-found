const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  status: { type: String, enum: ['lost', 'found'], required: true },
  itemName: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, default: 'other' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, required: true },
  isDayScholar: { type: Boolean, default: undefined },
  keeperInfo: { type: String, default: undefined },
  resolved: { type: Boolean, default: false },
  imageUrl: { type: String, default: undefined }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Item = mongoose.model('Item', itemSchema);

async function readAll() {
  return Item.find({ imageUrl: { $exists: true, $ne: null, $ne: '' } }).sort({ createdAt: -1 }).lean();
}

async function addItem(item) {
  const created = await Item.create(item);
  return created.toObject();
}

async function getById(id) {
  return Item.findById(id).lean();
}

async function search(query) {
  const baseFilter = { imageUrl: { $exists: true, $ne: null, $ne: '' } };
  
  if (!query) {
    return Item.find(baseFilter).sort({ createdAt: -1 }).lean();
  }
  
  const q = String(query).trim();
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return Item.find({
    ...baseFilter,
    $or: [
      { itemName: regex },
      { description: regex },
      { location: regex },
      { category: regex },
      { status: regex }
    ]
  }).sort({ createdAt: -1 }).lean();
}

module.exports = {
  readAll,
  addItem,
  getById,
  search
};
