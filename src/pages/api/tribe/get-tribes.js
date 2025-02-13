import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getTribes(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

// ----------------------------------------------------
// GET - List all tribes with their IDs
// ----------------------------------------------------
async function getTribes(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT id, name 
      FROM tribes 
      ORDER BY name ASC
    `);
    connection.release();
    
    return res.status(200).json({ 
      success: true, 
      data: rows 
    });
  } catch (error) {
    console.error("Error fetching tribes:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}