import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: 'developer.chciq0eeey32.ap-south-1.rds.amazonaws.com',
  user: 'dev_arunachal_user',
  password: 'JaiHindBharat$$321##',
  database: 'db_arunachal_pradesh',
  waitForConnections: true,
  connectionLimit: 10,  // Maximum connections in the pool
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

export default pool;