import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getUsers(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

async function getUsers(req, res) {
  try {
    const connection = await pool.getConnection();
    
    // Execute queries separately
    const [director] = await connection.query('SELECT id FROM users WHERE role_id = 1 LIMIT 1');
    const [deputy] = await connection.query('SELECT id FROM users WHERE role_id = 2 LIMIT 1');
    const [assistant] = await connection.query('SELECT id FROM users WHERE role_id = 3 LIMIT 1');
    const [cbo] = await connection.query('SELECT id FROM users WHERE role_id = 4 LIMIT 1');

    connection.release();

    const result = {
      director: director || null,
      deputy: deputy || null,
      assistant: assistant|| null,
      cbo: cbo || null
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}