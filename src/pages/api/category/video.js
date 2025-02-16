import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getVideos(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed` 
      });
  }
}

async function getVideos(req, res) {
  try {
    const { video_id } = req.query;
    const connection = await pool.getConnection();

    try {
      let query = 'SELECT * FROM video';
      let params = [];

      if (video_id) {
        query += ' WHERE id = ?';
        params.push(video_id);
      }

      const [rows] = await connection.query(query, params);
      return res.status(200).json({
        success: true,
        data: video_id ? rows[0] : rows
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error fetching video data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch video data'
    });
  }
}