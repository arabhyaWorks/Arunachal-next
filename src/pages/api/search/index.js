import pool from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ success: false, error: "term query param required" });
    }

    const connection = await pool.getConnection();

    // FULLTEXT search on searchable_text
    // We'll do a boolean mode for partial matching with +term or something
    const [rows] = await connection.query(`
      SELECT source_type, source_id,
             MATCH(searchable_text) AGAINST(? IN BOOLEAN MODE) AS relevance
      FROM search_index
      WHERE MATCH(searchable_text) AGAINST(? IN BOOLEAN MODE)
      ORDER BY relevance DESC
      LIMIT 50
    `, [term, term]);

    connection.release();

    // returns a list of { source_type, source_id, relevance }
    // frontend can do further calls to e.g. /api/tribe?id=..., /api/category/items?id=...
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error searching in search_index:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}