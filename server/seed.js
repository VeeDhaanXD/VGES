const mongoose = require('mongoose');
require('dotenv').config();
const ClassConfig = require('./models/ClassConfig');

// Connect to your MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔗 MongoDB Connected. Initializing Vault Protocol...');

    try {
      // 1. Wipe any existing codes so we start fresh
      await ClassConfig.deleteMany({});
      console.log('🧹 Cleared old class configurations.');

      // 2. Generate the official codes for Classes 1 through 10
      const vaultCodes = [];
      for (let i = 1; i <= 10; i++) {
        // Formats numbers 1-9 to have a leading zero (e.g., VGES-05)
        const formattedNumber = i < 10 ? `0${i}` : i; 
        
        vaultCodes.push({
          classNumber: i,
          classCode: `VGES-${formattedNumber}`
        });
      }

      // 3. Inject them into the database
      await ClassConfig.insertMany(vaultCodes);
      
      console.log('✅ Success! The following codes have been secured in the database:');
      console.table(vaultCodes.map(c => ({ Class: c.classNumber, Code: c.classCode })));
      
      // Close the connection securely
      process.exit();

    } catch (err) {
      console.error('❌ Seeding Error:', err.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log('❌ DB Connection Error: ', err);
  });