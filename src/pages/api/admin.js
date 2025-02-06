import pool from '../../utils/db';

// Next.js API route handler
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let connection;

  try {
    console.log("Attempting database connection...");

    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log("Connected to database successfully");

    // Execute query
    const [rows] = await connection.query('SELECT * FROM admin');

    console.log(`Fetched ${rows.length} records`);

    // Send response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query failed', details: error.message });
  } finally {
    // Release the connection
    if (connection) {
      connection.release();
      console.log("Database connection released");
    }
  }
}