// pages/api/committees/[committeeId]/members.js
import pool from "../../../../utils/db";

export default async function handler(req, res) {
  const { method, query } = req;
  const { committeeId } = query;

  switch (method) {
    case "GET":
      return listMembers(req, res, committeeId);
    case "POST":
      return addMember(req, res, committeeId);
    case "PATCH":
      return updateMember(req, res, committeeId);
    case "DELETE":
      return removeMember(req, res, committeeId);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

// GET /api/committees/[committeeId]/members
async function listMembers(req, res, committeeId) {
  if (!committeeId) {
    return res.status(400).json({ success: false, error: "committeeId required" });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT cm.*, u.username, u.first_name, u.last_name
       FROM committee_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.committee_id=?`,
      [committeeId]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error listing committee members:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}

// POST /api/committees/[committeeId]/members
// Body: { user_id, hierarchy_level, is_permanent }
async function addMember(req, res, committeeId) {
  const { user_id, hierarchy_level, is_permanent } = req.body;
  if (!committeeId || !user_id || !hierarchy_level) {
    return res.status(400).json({
      success: false,
      error: "committeeId, user_id, and hierarchy_level required",
    });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO committee_members 
       (committee_id, user_id, hierarchy_level, is_permanent)
       VALUES (?,?,?,?)`,
      [committeeId, user_id, hierarchy_level, !!is_permanent]
    );
    return res.status(201).json({ success: true, message: "Member added" });
  } catch (err) {
    console.error("Error adding member:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}

// PATCH /api/committees/[committeeId]/members
// Body: { id: <memberRecordId>, hierarchy_level, is_permanent }
async function updateMember(req, res, committeeId) {
  const { id, hierarchy_level, is_permanent } = req.body;
  if (!committeeId || !id) {
    return res.status(400).json({
      success: false,
      error: "committeeId & member record id required",
    });
  }
  let connection;
  try {
    connection = await pool.getConnection();

    const updates = [];
    const params = [];

    if (hierarchy_level !== undefined) {
      updates.push("hierarchy_level=?");
      params.push(hierarchy_level);
    }
    if (is_permanent !== undefined) {
      updates.push("is_permanent=?");
      params.push(is_permanent);
    }
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: "No fields to update" });
    }

    const sql = `
      UPDATE committee_members
      SET ${updates.join(", ")}
      WHERE committee_id=? AND id=?
    `;
    params.push(committeeId, id);
    await connection.query(sql, params);

    return res.status(200).json({ success: true, message: "Member updated" });
  } catch (err) {
    console.error("Error updating member:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}

// DELETE /api/committees/[committeeId]/members
// Query: ?memberId=123
async function removeMember(req, res, committeeId) {
  const { memberId } = req.query;
  if (!committeeId || !memberId) {
    return res.status(400).json({
      success: false,
      error: "committeeId & memberId required in query params",
    });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      `DELETE FROM committee_members 
       WHERE committee_id=? AND id=?`,
      [committeeId, memberId]
    );
    return res.status(200).json({ success: true, message: "Member removed" });
  } catch (err) {
    console.error("Error removing member:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) connection.release();
  }
}