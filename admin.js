require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

// Import the Item model
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
  resolved: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Item = mongoose.model('Item', itemSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lost_found';
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

async function showMenu() {
  console.log('\n🔧 MongoDB Admin Panel for Lost & Found');
  console.log('═'.repeat(50));
  console.log('1. View all items');
  console.log('2. View lost items only');
  console.log('3. View found items only');
  console.log('4. View pending items');
  console.log('5. View resolved items');
  console.log('6. Mark item as resolved');
  console.log('7. Delete an item');
  console.log('8. Search items');
  console.log('9. Database statistics');
  console.log('0. Exit');
  console.log('═'.repeat(50));
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function viewItems(filter = {}, title = 'All Items') {
  const items = await Item.find(filter).sort({ createdAt: -1 });
  console.log(`\n📊 ${title}: ${items.length} items`);
  
  items.forEach((item, index) => {
    console.log(`\n${index + 1}. [${item._id}] ${item.itemName} (${item.status.toUpperCase()})`);
    console.log(`   📍 ${item.location} | 📅 ${item.date} | ✅ ${item.resolved ? 'Resolved' : 'Pending'}`);
    console.log(`   📧 ${item.contactEmail}`);
    if (item.description) {
      console.log(`   📝 ${item.description}`);
    }
  });
}

async function markResolved() {
  const items = await Item.find({ resolved: false }).sort({ createdAt: -1 });
  if (items.length === 0) {
    console.log('📭 No pending items to resolve');
    return;
  }

  console.log('\n📋 Pending Items:');
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.itemName} - ${item._id}`);
  });

  const choice = await askQuestion('\nEnter item number to mark as resolved (0 to cancel): ');
  const itemIndex = parseInt(choice) - 1;
  
  if (itemIndex >= 0 && itemIndex < items.length) {
    const item = items[itemIndex];
    await Item.findByIdAndUpdate(item._id, { resolved: true });
    console.log(`✅ Marked "${item.itemName}" as resolved`);
  }
}

async function deleteItem() {
  const items = await Item.find().sort({ createdAt: -1 });
  if (items.length === 0) {
    console.log('📭 No items to delete');
    return;
  }

  console.log('\n📋 All Items:');
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.itemName} (${item.status}) - ${item._id}`);
  });

  const choice = await askQuestion('\nEnter item number to delete (0 to cancel): ');
  const itemIndex = parseInt(choice) - 1;
  
  if (itemIndex >= 0 && itemIndex < items.length) {
    const item = items[itemIndex];
    const confirm = await askQuestion(`❗ Are you sure you want to delete "${item.itemName}"? (y/N): `);
    if (confirm.toLowerCase() === 'y') {
      await Item.findByIdAndDelete(item._id);
      console.log(`🗑️ Deleted "${item.itemName}"`);
    }
  }
}

async function searchItems() {
  const query = await askQuestion('🔍 Enter search term: ');
  if (!query.trim()) return;

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await Item.find({
    $or: [
      { itemName: regex },
      { description: regex },
      { location: regex },
      { category: regex },
      { contactName: regex },
      { contactEmail: regex }
    ]
  }).sort({ createdAt: -1 });

  await viewItems({}, `Search Results for "${query}"`);
}

async function showStats() {
  const total = await Item.countDocuments();
  const lost = await Item.countDocuments({ status: 'lost' });
  const found = await Item.countDocuments({ status: 'found' });
  const resolved = await Item.countDocuments({ resolved: true });
  const pending = total - resolved;

  console.log('\n📈 Database Statistics:');
  console.log('═'.repeat(30));
  console.log(`📊 Total Items: ${total}`);
  console.log(`🔍 Lost Items: ${lost}`);
  console.log(`🎯 Found Items: ${found}`);
  console.log('═'.repeat(30));
}

async function main() {
  try {
    await connectDB();
    
    while (true) {
      await showMenu();
      const choice = await askQuestion('Select an option: ');
      
      switch (choice) {
        case '1':
          await viewItems();
          break;
        case '2':
          await viewItems({ status: 'lost' }, 'Lost Items');
          break;
        case '3':
          await viewItems({ status: 'found' }, 'Found Items');
          break;
        case '4':
          await viewItems({ resolved: false }, 'Pending Items');
          break;
        case '5':
          await viewItems({ resolved: true }, 'Resolved Items');
          break;
        case '6':
          await markResolved();
          break;
        case '7':
          await deleteItem();
          break;
        case '8':
          await searchItems();
          break;
        case '9':
          await showStats();
          break;
        case '0':
          console.log('👋 Goodbye!');
          process.exit(0);
        default:
          console.log('❌ Invalid option');
      }
      
      await askQuestion('\nPress Enter to continue...');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

main();