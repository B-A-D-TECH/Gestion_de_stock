const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool;

const initializeDatabase = async () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_stock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query('SELECT 1');
  console.log('Connexion MySQL établie.');

  return pool;
};

const getConnection = () => {
  if (!pool) {
    throw new Error('Pool MySQL non initialisé.');
  }
  return pool;
};

module.exports = {
  initializeDatabase,
  getConnection,
};
