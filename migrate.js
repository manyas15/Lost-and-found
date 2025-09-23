require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

async function migrateData() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lost_found';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingCount = await Item.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing items in MongoDB`);
      const answer = await askUser('Do you want to clear existing data and migrate? (y/n): ');
      if (answer.toLowerCase() !== 'y') {
        console.log(' Migration cancelled');
        process.exit(0);
      }
      await Item.deleteMany({});
      console.log('Cleared existing data');
    }

    // Read JSON file
    const jsonPath = path.join(__dirname, 'data', 'items.json');
    if (!fs.existsSync(jsonPath)) {
      console.log(' No items.json file found');
      process.exit(1);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Found ${jsonData.length} items in JSON file`);

    // Transform and insert data
    const transformedItems = jsonData.map(item => ({
      status: item.status,
      itemName: item.itemName,
      description: item.description || '',
      location: item.location,
      date: item.date,
      category: item.category || 'other',
      contactName: item.contactName || '',
      contactEmail: item.contactEmail,
      isDayScholar: item.isDayScholar,
      keeperInfo: item.keeperInfo,
      resolved: item.resolved || false,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
    }));

    await Item.insertMany(transformedItems);
    console.log(`✅ Successfully migrated ${transformedItems.length} items to MongoDB`);

    // Create backup of JSON file
    const backupPath = path.join(__dirname, 'data', `items_backup_${Date.now()}.json`);
    fs.copyFileSync(jsonPath, backupPath);
    console.log(`Created backup at ${backupPath}`);

    console.log(' Migration completed successfully!');
    
  } catch (error) {
    console.error(' Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
}

function askUser(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

migrateData();