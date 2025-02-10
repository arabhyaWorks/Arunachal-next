import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getCategoryAttributes(req, res);
    case "POST":
      return createCategoryAttribute(req, res);
    case "PATCH":
      return updateCategoryAttribute(req, res);
    case "DELETE":
      return deleteCategoryAttribute(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

/**
 * GET /api/category/attributes?category_id=10
 * -> returns all active attributes for category
 */
async function getCategoryAttributes(req, res) {
  const { category_id } = req.query;
  if (!category_id) {
    return res
      .status(400)
      .json({ success: false, error: "category_id required" });
  }
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `
      SELECT a.id, a.name, a.description, a.attribute_type_id,
             cac.is_active, cac.display_order
      FROM attributes a
      JOIN category_attribute_config cac ON a.id=cac.attribute_id
      WHERE cac.category_id=?
        AND cac.is_active=true
      ORDER BY cac.display_order`,
      [category_id]
    );
    connection.release();
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error getting cat attributes:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/category/attributes
 * Body:
 * {
 *   "category_id":10,
 *   "attribute_name":"danceVideos",
 *   "attribute_type_id":9,   // e.g. "Video"
 *   "description":"Dance videos of the tribe dance",
 *   "is_required":true,
 *   "user_id":1
 * }
 */
async function createCategoryAttribute(req, res) {
  try {
    const {
      category_id,
      category_name,
      attribute_name,
      attribute_type_id,
      description,
      is_required,
      user_id,
    } = req.body;
    if (!category_id || !attribute_name || !attribute_type_id || !user_id) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }
    const connection = await pool.getConnection();

    const formattedName =
      "cat-" + nomenclature(category_name) + "-" + nomenclature(attribute_name);
    // create attribute
    const [attrRes] = await connection.query(
      `
      INSERT INTO attributes (attribute_type_id, name, description, is_required)
      VALUES (?,?,?,?)`,
      [attribute_type_id, formattedName, description || "", !!is_required]
    );
    const newAttrId = attrRes.insertId;

    // get display_order
    const [orderRows] = await connection.query(
      `
      SELECT IFNULL(MAX(display_order),0) as lastOrder
      FROM category_attribute_config
      WHERE category_id=?`,
      [category_id]
    );
    const newDisplay = orderRows[0].lastOrder + 1;

    // link in category_attribute_config
    await connection.query(
      `
      INSERT INTO category_attribute_config
      (category_id, attribute_id, display_order, created_by)
      VALUES (?,?,?,?)`,
      [category_id, newAttrId, newDisplay, user_id]
    );

    connection.release();
    return res.status(201).json({
      success: true,
      message: "Category attribute created",
      attribute_id: newAttrId,
    });
  } catch (error) {
    console.error("Error creating cat attribute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * PATCH /api/category/attributes?id=attrId&category_id=10
 * Body:
 * {
 *   "is_active":false,
 *   "display_order":5,
 *   "user_id":1
 * }
 */
async function updateCategoryAttribute(req, res) {
  const { id, category_id } = req.query;
  if (!id || !category_id) {
    return res
      .status(400)
      .json({ success: false, error: "id&category_id required" });
  }
  try {
    const { is_active, display_order, user_id } = req.body;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, error: "user_id required" });
    }
    const connection = await pool.getConnection();

    const updates = [];
    const params = [];
    if (is_active !== undefined) {
      updates.push("is_active=?");
      params.push(is_active);
    }
    if (display_order !== undefined) {
      updates.push("display_order=?");
      params.push(display_order);
    }
    if (updates.length === 0) {
      connection.release();
      return res
        .status(400)
        .json({ success: false, error: "No fields to update" });
    }
    const sql = `
      UPDATE category_attribute_config
      SET ${updates.join(", ")}, updated_by=?
      WHERE category_id=? AND attribute_id=?`;
    params.push(user_id, category_id, id);

    await connection.query(sql, params);
    connection.release();
    return res
      .status(200)
      .json({ success: true, message: "Category attribute updated" });
  } catch (error) {
    console.error("Error updating cat attribute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * DELETE /api/category/attributes?id=attrId&category_id=10
 * soft delete => is_active=false
 */
async function deleteCategoryAttribute(req, res) {
  try {
    const { id, category_id } = req.query;
    if (!id || !category_id) {
      return res
        .status(400)
        .json({ success: false, error: "id&category_id required" });
    }
    const connection = await pool.getConnection();
    await connection.query(
      `
      UPDATE category_attribute_config
      SET is_active=false
      WHERE category_id=? AND attribute_id=?`,
      [category_id, id]
    );
    connection.release();
    return res.status(200).json({
      success: true,
      message: `Category attribute soft-deleted`,
    });
  } catch (error) {
    console.error("Error deleting cat attribute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

function nomenclature(data) {
  return data
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
