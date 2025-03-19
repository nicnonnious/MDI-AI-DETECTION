const { Pool } = require('pg');
const config = require('../config');

// Create a new Pool instance for database connections
const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: config.db.ssl ? {
    rejectUnauthorized: false // Necessary for some cloud providers
  } : false
});

// Event listener for errors on any idle client
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Simple query method that logs the query for debugging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (err) {
    console.error('Error executing query', { text, err });
    throw err;
  }
};

// Get a client from the pool to perform multiple operations
const getClient = async () => {
  const client = await pool.connect();
  const originalRelease = client.release;
  
  // Override the release method to log duration
  client.release = () => {
    originalRelease.apply(client);
    console.log('Client returned to pool');
  };
  
  return client;
};

// Transaction helper
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  getClient,
  transaction,
  pool
}; 