import pool from '../../utils/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getAllAttributeTypes(req, res);

    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .json({ success: false, error: `Method ${method} Not Allowed` });
  }
}

// ----------------------------------------------------
// GET - Return all attribute types
// ----------------------------------------------------
async function getAllAttributeTypes(req, res) {
  try {
    const connection = await pool.getConnection();

    // Fetch everything from the attribute_types table
    const [rows] = await connection.query(`
      SELECT
        id,
        name,
        description,
        validation_rules,
        value_structure,
        meta_data
      FROM attribute_types
      ORDER BY id
    `);

    connection.release();

    // Return the entire list as JSON
    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching attribute types:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}