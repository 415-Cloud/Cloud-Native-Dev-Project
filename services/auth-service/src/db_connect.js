// services/auth-service/src/db_connect.js

const { Pool } = require('pg');

// 1. Read configuration from environment variables
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  // Optional: Set a max number of clients in the pool
  max: 20, 
});

// 2. Export a function to execute queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};