import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      if (req.query.active) {
        return getActiveContent(req, res);
      }
      return getAllContent(req, res);
    case "POST":
      return approveContent(req, res);
    case "DELETE":
      return blockContent(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}
/**
 * GET /api/content
 * Query parameters:
 * - page (optional): Page number for pagination
 * - limit (optional): Items per page
 * - associated_table_id (optional): Filter by associated_table_id
 * - search (optional): Search in name field
 */
async function getAllContent(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      associated_table_id,
      search,
      level,
    } = req.query;

    if (!level) {
      return res.status(400).json({
        success: false,
        error: "Level parameter is required",
      });
    }

    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    // Build WHERE clause based on filters
    const whereConditions = [
      "c.associated_table = 'tribe'",
      "ca.current_level = ?", // Add level condition
    ];
    const queryParams = [level]; // Add level to params

    if (associated_table_id) {
      whereConditions.push("c.associated_table_id = ?");
      queryParams.push(associated_table_id);
    }

    if (search) {
      whereConditions.push("MATCH(c.name) AGAINST(? IN BOOLEAN MODE)");
      queryParams.push(`*${search}*`);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Get total count for pagination
    const [countRows] = await connection.query(
      `
        SELECT COUNT(*) as total 
        FROM content c 
        INNER JOIN content_approval ca ON c.id = ca.content_id
        ${whereClause}`,
      queryParams
    );

    // Get content with related data
    const [rows] = await connection.query(
      `
        SELECT 
          c.id,
          c.name,
          c.associated_table,
          c.associated_table_id,
          c.attribute_id,
          c.status,
          c.value,
          c.created_at,
          c.updated_at,
          c.created_by,
          c.updated_by,
          a.name as attribute_name,
          ca.current_level,
          ca.status as approval_status,
          ca.remarks as approval_remarks,
          ca.committee_id
        FROM content c
        INNER JOIN content_approval ca ON c.id = ca.content_id
        LEFT JOIN attributes a ON c.attribute_id = a.id
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    connection.release();

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(countRows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/content?active=true
 * Returns only active content with same filtering options as getAllContent
 */
async function getActiveContent(req, res) {
  try {
    const { page = 1, limit = 10, associated_table_id, search } = req.query;

    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    // Build WHERE clause
    const whereConditions = [
      "c.status = 'active'",
      "c.associated_table = 'tribe'", // Fixed filter
    ];
    const queryParams = [];

    if (associated_table_id) {
      whereConditions.push("c.associated_table_id = ?");
      queryParams.push(associated_table_id);
    }

    if (search) {
      whereConditions.push("MATCH(c.name) AGAINST(? IN BOOLEAN MODE)");
      queryParams.push(`*${search}*`);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Get total count
    const [countRows] = await connection.query(
      `
      SELECT COUNT(*) as total 
      FROM content c 
      ${whereClause}`,
      queryParams
    );

    // Get active content
    const [rows] = await connection.query(
      `
      SELECT 
        c.id,
        c.name,
        c.associated_table,
        c.associated_table_id,
        c.attribute_id,
        c.status,
        c.value,
        c.created_at,
        c.updated_at,
        c.created_by,
        c.updated_by,
        a.name as attribute_name
      FROM content c
      LEFT JOIN attributes a ON c.attribute_id = a.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    connection.release();

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(countRows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching active content:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/content/block
 * Body: {
 *   "content_id": 123,
 *   "user_id": 456
 * }
 */

async function approveContent(req, res) {
  try {
    const { content_id, updated_by } = req.query;
    const { remarks } = req.body;

    if (!content_id || !updated_by) {
      return res.status(400).json({
        success: false,
        error: "content_id and updated_by are required in URL parameters",
      });
    }

    // Check if updated_by is an authorized admin
    const authorizedAdmins = [1, 2, 3, 4];
    if (!authorizedAdmins.includes(Number(updated_by))) {
      return res.status(403).json({
        success: false,
        error:
          "Unauthorized. Only specific administrators can approve content.",
      });
    }

    const connection = await pool.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // First, get the current approval level
      const [approvalRows] = await connection.query(
        `
          SELECT current_level 
          FROM content_approval 
          WHERE content_id = ? 
          AND status != 'approved'
          LIMIT 1`,
        [content_id]
      );

      if (approvalRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          error: "No pending approval found for this content",
        });
      }

      const currentLevel = approvalRows[0].current_level;

      if (currentLevel === 1) {
        // Final approval level - update both content and approval status
        await connection.query(
          `
            UPDATE content 
            SET 
              status = 'active',
              updated_by = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ? 
            AND associated_table = 'tribe'`,
          [updated_by, content_id]
        );

        await connection.query(
          `
            UPDATE content_approval
            SET 
              status = 'approved',
              remarks = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE content_id = ?
            AND status != 'approved'`,
          [remarks || "Content approved", content_id]
        );
      } else {
        // Not final level - just decrease the current_level
        await connection.query(
          `
            UPDATE content_approval
            SET 
              current_level = current_level - 1,
              remarks = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE content_id = ?
            AND status != 'approved'`,
          [remarks || `Approved level ${currentLevel}`, content_id]
        );
      }

      // Commit transaction
      await connection.commit();

      return res.status(200).json({
        success: true,
        message:
          currentLevel === 1
            ? "Content approved successfully"
            : `Content approval level updated to ${currentLevel - 1}`,
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error approving content:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function blockContent(req, res) {
  try {
    const { content_id, updated_by } = req.query;
    const { remarks } = req.body;

    if (!content_id || !updated_by) {
      return res.status(400).json({
        success: false,
        error: "content_id and updated_by are required in URL parameters",
      });
    }

    // Check if updated_by is an authorized admin
    const authorizedAdmins = [1, 2, 3, 4];
    if (!authorizedAdmins.includes(Number(updated_by))) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only specific administrators can block content.",
      });
    }

    const connection = await pool.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // 1. Update content status to archived
      await connection.query(
        `
          UPDATE content 
          SET 
            status = 'archived',
            updated_by = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ? 
          AND associated_table = 'tribe'`,
        [updated_by, content_id]
      );

      // 2. Update content_approval status to rejected
      await connection.query(
        `
          UPDATE content_approval
          SET 
            status = 'rejected',
            remarks = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE content_id = ?
          AND status != 'rejected'`,
        [remarks || "Content blocked", content_id]
      );

      // Commit transaction
      await connection.commit();

      return res.status(200).json({
        success: true,
        message: "Content and approval status updated successfully",
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error blocking content:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
