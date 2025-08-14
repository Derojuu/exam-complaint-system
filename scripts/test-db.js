const { executeQuery } = require('../lib/db.js');

async function testConnection() {
  try {
    console.log('Testing PostgreSQL database connection...');
    const result = await executeQuery('SELECT 1 as test');
    console.log('Database connection test successful!');
    console.log('Test query result:', result.rows);
    process.exit(0);
  } catch (error) {
    console.error('Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection().catch(console.error);