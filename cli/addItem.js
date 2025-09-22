// Usage examples:
//   npm run cli:add -- lost "Wallet" "CSE Block" "2025-08-12" "Electronics" "email@uni.edu"
//   npm run cli:add -- found "ID Card" "Admin Office" "2025-08-14" "ID" "office@uni.edu"

const { addItem, createId } = require('../models/itemModel');

async function main() {
  const [type, itemName, location, date, category, contactEmail] = process.argv.slice(2);
  if (!['lost','found'].includes(type) || !itemName || !location || !date || !contactEmail) {
    console.log('Usage: npm run cli:add -- <lost|found> "<itemName>" "<location>" "<YYYY-MM-DD>" "<category?>" "<contactEmail>"');
    process.exit(1);
  }

  const item = {
    id: createId(),
    status: type,
    itemName,
    description: '',
    location,
    date,
    category: category || 'other',
    imageUrl: '',
    contactName: '',
    contactEmail,
    createdAt: new Date().toISOString(),
    resolved: false
  };

  await addItem(item);
  console.log('Added:', item);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
