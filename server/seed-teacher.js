const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Teacher = require('./models/Teacher'); 

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔗 MongoDB Connected. Forging Master Teacher Account...');

    try {
      const email = 'admin@vges.com';
      const password = 'adminpassword123'; // The raw password you will type in the UI
      
      // 1. Check if we already made one
      let teacher = await Teacher.findOne({ email });
      if (teacher) {
         console.log('⚠️ Master Teacher already exists!');
         console.log('📧 Email:', email);
         console.log('🔑 Password:', password);
         process.exit();
      }

      // 2. Create the new teacher profile
      teacher = new Teacher({
        name: 'VGES Principal',
        email: email,
        password: password, // We are about to encrypt this!
        subject: 'Administration'
      });

      // 3. Encrypt the password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(password, salt);
      
      // 4. Save to database
      await teacher.save();

      console.log('✅ Success! Master Teacher created and encrypted in the database.');
      console.log('-----------------------------------');
      console.log('📧 Login Email: admin@vges.com');
      console.log('🔑 Login Password: adminpassword123');
      console.log('-----------------------------------');
      
      process.exit();

    } catch (err) {
      console.error('❌ Seeding Error:', err.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log('❌ DB Connection Error: ', err);
  })