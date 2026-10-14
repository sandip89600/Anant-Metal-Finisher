require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const env = require('../src/config/env');
const logger = require('../src/utils/logger');

async function seedAdmin() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for admin setup');

    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@anantmetalfinishers.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AmfNashik@2026AdminSecure!';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'AMF Operations Desk';

    let admin = await Admin.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      logger.info(`Admin user with email ${adminEmail} already exists. Updating credentials...`);
      admin.name = adminName;
      admin.password = adminPassword; // Will be hashed by pre-save hook
      admin.isActive = true;
      admin.role = 'superadmin';
      await admin.save();
      logger.info(`Admin user [${adminEmail}] updated successfully.`);
    } else {
      admin = new Admin({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'superadmin',
        isActive: true
      });
      await admin.save();
      logger.info(`Initial admin account created: [${adminEmail}].`);
    }

    console.log('\n======================================================');
    console.log('  ANANT METAL FINISHERS (AMF) - ADMIN INITIALIZATION  ');
    console.log('======================================================');
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Role:     superadmin`);
    console.log(`  Password: [Set via INITIAL_ADMIN_PASSWORD or default secure dev key]`);
    console.log('  NOTE: In production, immediately change your password');
    console.log('  from the Admin Settings / Security panel after first login.');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Admin seeding failed', { error: error.message });
    process.exit(1);
  }
}

seedAdmin();
