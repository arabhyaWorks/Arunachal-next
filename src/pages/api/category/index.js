import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return createCategory(req, res);
    case "GET":
      return getCategories(req, res);
    // Optional: If you want to update category-level attributes,
    // you can keep a PATCH. Or you can do it via /api/category/attributes
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

/**
 * POST /api/category
 * Body:
 * {
 *   "name": "Folk Dance",
 *   "description": "Various tribal dances",
 *   "user_id":1
 * }
 */
async function createCategory(req, res) {
  try {
    const { name, description, user_id } = req.body;
    if (!name || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "Name & user_id required" });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `
      INSERT INTO categories (name, description, created_by)
      VALUES (?,?,?)`,
      [name, description || "", user_id]
    );
    const category_id = result.insertId;

    const formattedName =
      "cat-" + nomenclature(name) + "-" + nomenclature("Tribe");
    // create attribute
    const [attrRes] = await connection.query(
      `
      INSERT INTO attributes (attribute_type_id, name, description, is_required)
      VALUES (6, ?, 'Tribe', true)`,
      [formattedName]
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

    return res.status(201).json({
      success: true,
      message: "Category created",
      data: { category_id: category_id },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/category
 *   ?id=10 => get single category + any top-level attributes (if needed)
 *   else => list all categories
 */
async function getCategories(req, res) {
  try {
    const { id } = req.query;
    const connection = await pool.getConnection();

    if (id) {
      // Single category
      const [catRows] = await connection.query(
        `SELECT * FROM categories WHERE id=?`,
        [id]
      );
      if (catRows.length === 0) {
        connection.release();
        return res
          .status(404)
          .json({ success: false, error: "Category not found" });
      }
      const category = catRows[0];
      connection.release();
      return res.status(200).json({ success: true, data: category });
    } else {
      // All categories
      const [rows] = await connection.query(`SELECT * FROM categories`);
      connection.release();
      return res.status(200).json({ success: true, data: rows });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}


function nomenclature(data) {
  return data
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}