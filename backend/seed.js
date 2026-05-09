const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const email = 'admin@pucit.edu.pk';
    const password = 'admin123';
    const name = 'Master Admin';
    const role = 'admin';

    // Check if admin already exists
    const check = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [hash, role, email]);
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating master admin account...');
      const hash = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [name, email, hash, role]
      );
      console.log('Master admin account created successfully!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
