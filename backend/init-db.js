const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDB() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
    console.log('Running schema.sql...');
    await db.query(sql);
    console.log('Database schema successfully initialized!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

initDB();
