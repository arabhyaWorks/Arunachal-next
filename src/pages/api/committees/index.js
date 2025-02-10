// pages/api/committees/index.js
import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      return getCommittees(req, res, id);
    // case "POST":
    //   return createCommittee(req, res);
    case "PATCH":
        return updateCommittee(req, res, id);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

// GET /api/committees
//   ?id= -> fetch single
//   else -> fetch all
async function getCommittees(req, res, committeeId) {
  let connection;
  try {
    connection = await pool.getConnection();

    if (committeeId) {
      // single
      const [rows] = await connection.query(
        `SELECT * FROM committees WHERE id=?`,
        [committeeId]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Committee not found" });
      }
      const committee = rows[0];

      // fetch members
      const [members] = await connection.query(
        `SELECT cm.*, u.username, u.first_name, u.last_name
         FROM committee_members cm
         JOIN users u ON cm.user_id = u.id
         WHERE cm.committee_id=?`,
        [committeeId]
      );

      return res.status(200).json({
        success: true,
        data: {
          ...committee,
          members: members,
        },
      });
    } else {
      // all committees
      const [rows] = await connection.query(`SELECT * FROM committees`);
      return res.status(200).json({ success: true, data: rows });
    }
  } catch (err) {
    console.error("Error fetching committees:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}

// POST /api/committees
// Body: { tribe_id, name, purpose, user_id }
async function createCommittee(req, res) {
  const { tribe_id, name, purpose, user_id } = req.body;
  if (!tribe_id || !name || !user_id) {
    return res.status(400).json({
      success: false,
      error: "tribe_id, name, and user_id are required",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO committees (tribe_id, name, purpose, created_by)
       VALUES (?, ?, ?, ?)`,
      [tribe_id, name, purpose || "", user_id]
    );
    return res.status(201).json({
      success: true,
      committee_id: result.insertId,
      message: "Committee created",
    });
  } catch (err) {
    console.error("Error creating committee:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}

/**
 * PATCH /api/committees/[committeeId]
 * Body: { name, purpose, user_id }
 */
async function updateCommittee(req, res, committeeId) {
    const { name, purpose, user_id } = req.body;
    if (!committeeId || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "committeeId & user_id required" });
    }
    let connection;
    try {
      connection = await pool.getConnection();
  
      const updates = [];
      const params = [];
  
      if (name !== undefined) {
        updates.push("name=?");
        params.push(name);
      }
      if (purpose !== undefined) {
        updates.push("purpose=?");
        params.push(purpose);
      }
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No fields to update",
        });
      }
      const sql = `
        UPDATE committees
        SET ${updates.join(", ")}, updated_by=?
        WHERE id=?
      `;
      params.push(user_id, committeeId);
  
      await connection.query(sql, params);
      return res.status(200).json({ success: true, message: "Committee updated" });
    } catch (err) {
      console.error("Error updating committee:", err);
      return res.status(500).json({ success: false, error: err.message });
    } finally {
      if (connection) connection.release();
    }
  }