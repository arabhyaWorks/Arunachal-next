import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getAudios(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed` 
      });
  }
}

async function getAudios(req, res) {
  try {
    const { audio_id } = req.query;
    const connection = await pool.getConnection();

    try {
      let query = 'SELECT * FROM audio';
      let params = [];

      if (audio_id) {
        query += ' WHERE id = ?';
        params.push(audio_id);
      }

      const [rows] = await connection.query(query, params);
      return res.status(200).json({
        success: true,
        data: audio_id ? rows[0] : rows
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error fetching audio data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch audio data'
    });
  }
}