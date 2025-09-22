require('dotenv').config();
const mongoose = require('mongoose');

// Import the Item model (same as in your app)
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

async function viewData() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lost_found';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`🔗 Database: ${mongoose.connection.db.databaseName}`);
    console.log('═'.repeat(60));

    // Get total count
    const totalCount = await Item.countDocuments();
    console.log(`📊 Total Items: ${totalCount}`);
    console.log('═'.repeat(60));

    // Get all items
    const items = await Item.find().sort({ createdAt: -1 });
    
    if (items.length === 0) {
      console.log('📭 No items found in the database');
      return;
    }

    // Display each item
    items.forEach((item, index) => {
      console.log(`\n🔍 Item ${index + 1}:`);
      console.log(`   ID: ${item._id}`);
      console.log(`   Status: ${item.status.toUpperCase()}`);
      console.log(`   Name: ${item.itemName}`);
      console.log(`   Description: ${item.description || 'No description'}`);
      console.log(`   Location: ${item.location}`);
      console.log(`   Date: ${item.date}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Contact: ${item.contactName} (${item.contactEmail})`);
      if (item.keeperInfo) {
        console.log(`   Keeper Info: ${item.keeperInfo}`);
      }
      if (item.isDayScholar !== undefined) {
        console.log(`   Day Scholar: ${item.isDayScholar ? 'Yes' : 'No'}`);
      }
      console.log(`   Resolved: ${item.resolved ? 'Yes' : 'No'}`);
      console.log(`   Created: ${item.createdAt}`);
      console.log('─'.repeat(40));
    });

    // Show statistics
    console.log('\n📈 Statistics:');
    const lostCount = await Item.countDocuments({ status: 'lost' });
    const foundCount = await Item.countDocuments({ status: 'found' });
    const resolvedCount = await Item.countDocuments({ resolved: true });
    
    console.log(`   Lost Items: ${lostCount}`);
    console.log(`   Found Items: ${foundCount}`);
    console.log(`   Resolved Items: ${resolvedCount}`);
    console.log(`   Pending Items: ${totalCount - resolvedCount}`);

  } catch (error) {
    console.error('❌ Error viewing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Check command line arguments for specific queries
const args = process.argv.slice(2);
if (args.length > 0) {
  const command = args[0];
  
  if (command === 'lost') {
    viewSpecificData({ status: 'lost' }, 'Lost Items');
  } else if (command === 'found') {
    viewSpecificData({ status: 'found' }, 'Found Items');
  } else if (command === 'resolved') {
    viewSpecificData({ resolved: true }, 'Resolved Items');
  } else if (command === 'pending') {
    viewSpecificData({ resolved: false }, 'Pending Items');
  } else {
    console.log('Usage: node view-data.js [lost|found|resolved|pending]');
    process.exit(1);
  }
} else {
  viewData();
}

async function viewSpecificData(filter, title) {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lost_found';
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB - Viewing ${title}`);
    console.log('═'.repeat(60));

    const items = await Item.find(filter).sort({ createdAt: -1 });
    console.log(`📊 ${title}: ${items.length} items`);
    
    items.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.itemName} (${item.status})`);
      console.log(`   📍 ${item.location} | 📅 ${item.date}`);
      console.log(`   📧 ${item.contactEmail}`);
      if (item.description) {
        console.log(`   📝 ${item.description}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}