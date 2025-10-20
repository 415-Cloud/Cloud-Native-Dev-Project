// services/auth-service/src/test_connection.js

const db = require('./db_connect');

async function testConnection() {
  try {
    // Attempt a very simple query that all PostgreSQL databases support
    const res = await db.query('SELECT NOW()');
    console.log('Database Connection Successful! Current time:', res.rows[0].now);
  } catch (err) {
    console.error('Database Connection Failed!', err.stack);
  }
}

testConnection();