// services/auth-service/src/index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import the database connection
const db = require('./db_connect');

// Simple health check route
app.get('/health', (req, res) => {
  // Use the test connection logic you already wrote
  db.query('SELECT 1')
    .then(() => res.status(200).send({ status: 'OK', database: 'connected' }))
    .catch(() => res.status(500).send({ status: 'Error', database: 'failed' }));
});


// 🚨 The registration route will go here 🚨
// require('./routes/auth_routes')(app); 
// We will create the routes file next.

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});