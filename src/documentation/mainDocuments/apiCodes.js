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


import pool from "../../../utils/db";
import attributeTypes from "../../../utils/attributeTypes";

// Assumed constant for "Relations" type (i.e. for tribe references)
const RELATIONS_TYPE_ID = 6;

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      return createCategoryItem(req, res);
    case "GET":
      return getCategoryItems(req, res);
    case "PATCH":
      return updateCategoryItem(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

/**
 * 1) POST /api/category/items
 *
 * Expected Body:
 * {
 *   "category_id": 10,
 *   "name": "Phangsao dance",
 *   "description": "Tribal dance from region X",
 *   "user_id": 1,
 *   "attributes": [
 *      { 
 *         "attribute_id": 99, 
 *         "attribute_type_id": 6, 
 *         "attribute_name": "Tribes", 
 *         "attribute_value": {
 *             "value": [
 *               { "associated_table": "tribes", "associated_table_id": 1, "name": "Adi" },
 *               { "associated_table": "tribes", "associated_table_id": 2, "name": "Nyishi" }
 *             ]
 *         }
 *      },
 *      { 
 *         "attribute_id": 100, 
 *         "attribute_type_id": 1, 
 *         "attribute_name": "Type of dance", 
 *         "attribute_value": { "value": "ritualistic" }
 *      },
 *      ...
 *   ]
 * }
 *
 * Note: One of the attributes (the one with attribute_type_id === 6) must provide the tribe references.
 */
async function createCategoryItem(req, res) {
  try {
    const { category_id, name, description, user_id, attributes } = req.body;
    if (!category_id || !name || !user_id) {
      return res.status(400).json({
        success: false,
        error: "category_id, name, and user_id are required",
      });
    }

    const connection = await pool.getConnection();

    // 1) Fetch required attributes for this category
    const [requiredRows] = await connection.query(
      `
      SELECT a.id as attribute_id, a.is_required
      FROM category_attribute_config cac
      JOIN attributes a ON cac.attribute_id = a.id
      WHERE cac.category_id = ?
        AND cac.is_active = true
      `,
      [category_id]
    );

    const requiredIds = requiredRows
      .filter((r) => r.is_required)
      .map((r) => r.attribute_id);

    // 2) Validate that all required attributes are provided
    const providedIds = (attributes || []).map((a) => a.attribute_id);
    for (const rid of requiredIds) {
      if (!providedIds.includes(rid)) {
        connection.release();
        return res.status(400).json({
          success: false,
          error: `Missing required attribute_id=${rid}`,
        });
      }
    }

    // 3) Extract tribe references from the attributes.
    // We expect one of the attributes to be the "Tribes" attribute (i.e. attribute_type_id === RELATIONS_TYPE_ID)
    let tribeReferences = null;
    for (const attr of attributes) {
      if (attr.attribute_type_id === RELATIONS_TYPE_ID) {
        tribeReferences = attr.attribute_value;
        break;
      }
    }
    if (!tribeReferences || !tribeReferences.value || !Array.isArray(tribeReferences.value)) {
      connection.release();
      return res.status(400).json({
        success: false,
        error: "Tribes attribute is required and must have valid references",
      });
    }

    // 4) Insert the category item record
    const [result] = await connection.query(
      `INSERT INTO category_items (category_id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
      [category_id, name, description || "", user_id]
    );
    const itemId = result.insertId;

    // 5) Process each attribute:
    if (Array.isArray(attributes)) {
      for (const attr of attributes) {
        const { attribute_id, attribute_type_id, attribute_name, attribute_value } = attr;

        // Process media if needed; otherwise, use the value directly.
        let storedValue = await processMediaIfNeeded(connection, attribute_type_id, attribute_value, user_id);

        // Insert into the content table with status 'pending'
        const [contentResult] = await connection.query(
          `INSERT INTO content 
           (name, associated_table, associated_table_id, attribute_id, status, value, created_by)
           VALUES (?, 'category_item', ?, ?, 'pending', ?, ?)`,
          [
            attribute_name || "",
            itemId,
            attribute_id,
            JSON.stringify(storedValue),
            user_id,
          ]
        );
        const contentId = contentResult.insertId;

        // 6) Upsert approval rows using the tribeReferences extracted earlier.
        await upsertApprovalsForTribes(connection, contentId, tribeReferences);
      }
    }

    connection.release();
    return res.status(201).json({
      success: true,
      message: "Category item created successfully",
      item_id: itemId,
    });
  } catch (error) {
    console.error("Error creating category item:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * 2) GET /api/category/items
 *    - ?category_id=  to list items for a category
 *    - ?item_id=      to fetch a single item (including its attribute values)
 */
async function getCategoryItems(req, res) {
  try {
    const { category_id, item_id } = req.query;
    const connection = await pool.getConnection();

    if (item_id) {
      // Fetch a single category item
      const [rows] = await connection.query(
        `SELECT * FROM category_items WHERE id = ?`,
        [item_id]
      );
      if (rows.length === 0) {
        connection.release();
        return res.status(404).json({ success: false, error: "Item not found" });
      }
      const item = rows[0];

      // Fetch attribute content values for that item
      const [attrRows] = await connection.query(
        `
        SELECT c.attribute_id, a.name AS attribute_name, 
               a.description AS attribute_description, a.attribute_type_id,
               c.value AS attribute_value,
               c.status AS content_status
        FROM content c
        JOIN attributes a ON c.attribute_id = a.id
        WHERE c.associated_table = 'category_item'
          AND c.associated_table_id = ?
        `,
        [item_id]
      );
      connection.release();

      const attributes = attrRows.map((r) => {
        let parsed = r.attribute_value;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch {}
        }
        return {
          attribute_id: r.attribute_id,
          attribute_name: r.attribute_name,
          attribute_description: r.attribute_description,
          attribute_type_id: r.attribute_type_id,
          attribute_value: parsed,
          content_status: r.content_status,
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          item_id: item.id,
          category_id: item.category_id,
          name: item.name,
          description: item.description,
          attributes,
        },
      });
    } else if (category_id) {
      // Fetch all items for a specific category
      const [rows] = await connection.query(
        `SELECT * FROM category_items WHERE category_id = ?`,
        [category_id]
      );
      connection.release();
      return res.status(200).json({ success: true, data: rows });
    } else {
      // Fetch all category items across all categories
      const [all] = await connection.query(`SELECT * FROM category_items`);
      connection.release();
      return res.status(200).json({ success: true, data: all });
    }
  } catch (error) {
    console.error("Error getting category items:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * 3) PATCH /api/category/items
 *
 * Expected Body:
 * {
 *   "item_id": 15,
 *   "name": "New dance name",
 *   "description": "Some description",
 *   "attributes": [
 *      { 
 *         "attribute_id": 99, 
 *         "attribute_type_id": 6, 
 *         "attribute_name": "Tribes", 
 *         "attribute_value": { ... } 
 *      },
 *      { 
 *         "attribute_id": 100, 
 *         "attribute_type_id": 1, 
 *         "attribute_name": "Type of dance", 
 *         "attribute_value": { "value": "celebratory" }
 *      }
 *   ],
 *   "user_id": 1
 * }
 *
 * Here we update the category item’s details and for every attribute,
 * we reset its status to 'pending' and then upsert the multi-committee approvals
 * based on the (possibly updated) tribe references.
 */
async function updateCategoryItem(req, res) {
  try {
    const { item_id, name, description, attributes, user_id } = req.body;
    if (!item_id || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "item_id & user_id required" });
    }

    const connection = await pool.getConnection();

    // 1) Update the category item record if name/description provided
    if (name || description !== undefined) {
      let q = "UPDATE category_items SET ";
      const arr = [];
      if (name) {
        q += " name = ?, ";
        arr.push(name);
      }
      if (description !== undefined) {
        q += " description = ?, ";
        arr.push(description);
      }
      q = q.slice(0, -2) + " WHERE id = ?";
      arr.push(item_id);
      await connection.query(q, arr);
    }

    // 2) Determine tribe references for this category item.
    // Try to extract from the attributes provided.
    let tribeReferences = null;
    if (Array.isArray(attributes)) {
      for (const attr of attributes) {
        if (attr.attribute_type_id === RELATIONS_TYPE_ID) {
          tribeReferences = attr.attribute_value;
          break;
        }
      }
    }
    // Optionally, if not provided, you could query the existing "Tribes" content row.
    if (!tribeReferences) {
      const [tribeRows] = await connection.query(
        `SELECT value FROM content 
         WHERE associated_table = 'category_item'
           AND associated_table_id = ?
           AND attribute_id IN (
             SELECT attribute_id FROM category_attribute_config
             WHERE category_id = (SELECT category_id FROM category_items WHERE id = ?)
               AND is_active = true
           )
           AND JSON_CONTAINS(value, '"tribes"', '$') LIMIT 1`,
        [item_id, item_id]
      );
      if (tribeRows.length) {
        tribeReferences = JSON.parse(tribeRows[0].value);
      }
    }
    if (!tribeReferences || !tribeReferences.value || !Array.isArray(tribeReferences.value)) {
      connection.release();
      return res.status(400).json({
        success: false,
        error: "Tribes attribute is required for multi-committee validation",
      });
    }

    // 3) Process each attribute update
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (const attr of attributes) {
        const { attribute_id, attribute_type_id, attribute_name, attribute_value } = attr;
        let storedValue = await processMediaIfNeeded(connection, attribute_type_id, attribute_value, user_id);

        // Check if a content row exists for this attribute
        const [existingRow] = await connection.query(
          `SELECT id FROM content 
           WHERE associated_table = 'category_item'
             AND associated_table_id = ?
             AND attribute_id = ?`,
          [item_id, attribute_id]
        );
        let contentId;
        if (existingRow.length === 0) {
          // Insert new attribute content (set status to 'pending')
          const [insertResult] = await connection.query(
            `INSERT INTO content 
               (name, associated_table, associated_table_id, attribute_id, status, value, created_by)
             VALUES (?, 'category_item', ?, ?, 'pending', ?, ?)`,
            [
              attribute_name || "",
              item_id,
              attribute_id,
              JSON.stringify(storedValue),
              user_id,
            ]
          );
          contentId = insertResult.insertId;
        } else {
          // Update existing attribute content and reset status to 'pending'
          contentId = existingRow[0].id;
          await connection.query(
            `UPDATE content 
             SET value = ?, updated_by = ?, status = 'pending'
             WHERE id = ?`,
            [JSON.stringify(storedValue), user_id, contentId]
          );
        }
        // 4) Upsert approval rows for all referenced tribes (from tribeReferences)
        await upsertApprovalsForTribes(connection, contentId, tribeReferences);
      }
    }

    connection.release();
    return res.status(200).json({ success: true, message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating category item:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/* =========================================================================
   HELPER FUNCTIONS
   ========================================================================= */

/**
 * processMediaIfNeeded:
 *   If the attribute_type_id indicates media (Audio, Video, Document),
 *   call the corresponding createOrUpdate functions.
 *   Otherwise, simply return the attribute_value.
 */
async function processMediaIfNeeded(connection, attribute_type_id, attribute_value, user_id) {
  let storedValue = attribute_value;
  if (attribute_type_id === 8) {
    storedValue = await createOrUpdateAudio(connection, attribute_value, user_id);
  } else if (attribute_type_id === 9) {
    storedValue = await createOrUpdateVideos(connection, attribute_value);
  } else if (attribute_type_id === 10) {
    storedValue = await createOrUpdateDocuments(connection, attribute_value, user_id);
  }
  return storedValue;
}

/**
 * createOrUpdateAudio:
 *   Combines your create and update logic for audio.
 */
async function createOrUpdateAudio(connection, audioData, user_id) {
  if (!Array.isArray(audioData) || audioData.length === 0) return [];
  const audioIds = [];
  for (const audio of audioData) {
    const { id, title, description, file_path, thumbnail_path, lyrics, genre, composer, performers, instruments, mime_type } = audio;
    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for audio upload");
    }
    if (id) {
      await connection.query(
        `UPDATE audio 
         SET title=?, description=?, file_path=?, thumbnail_path=?, lyrics=?, 
             genre=?, composer=?, performers=?, instruments=?, mime_type=?, updated_by=?
         WHERE id=?`,
        [
          title, description || "", file_path, thumbnail_path || "", lyrics || "",
          JSON.stringify(genre || []), composer || "",
          JSON.stringify(performers || []), JSON.stringify(instruments || []),
          mime_type, user_id, id,
        ]
      );
      audioIds.push(id);
    } else {
      const [result] = await connection.query(
        `INSERT INTO audio 
         (title, description, file_path, thumbnail_path, lyrics, genre, composer, performers, instruments, mime_type, created_by) 
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          title, description || "", file_path, thumbnail_path || "", lyrics || "",
          JSON.stringify(genre || []), composer || "",
          JSON.stringify(performers || []), JSON.stringify(instruments || []),
          mime_type, user_id,
        ]
      );
      audioIds.push(result.insertId);
    }
  }
  return audioIds;
}

async function createOrUpdateVideos(connection, videos) {
  if (!Array.isArray(videos) || videos.length === 0) return [];
  const videoIds = [];
  for (const video of videos) {
    const { id, title, description, file_path, thumbnail_path, mime_type, created_by, status } = video;
    if (!title || !file_path || !mime_type || !created_by) {
      throw new Error("Missing required fields for video upload");
    }
    if (id) {
      await connection.query(
        `UPDATE video 
         SET title=?, description=?, file_path=?, thumbnail_path=?, mime_type=?, status=?, updated_by=?
         WHERE id=?`,
        [title, description || "", file_path, thumbnail_path || "", mime_type, status || "pending", created_by, id]
      );
      videoIds.push(id);
    } else {
      const [result] = await connection.query(
        `INSERT INTO video 
         (title, description, file_path, thumbnail_path, media_type, mime_type, status, created_by) 
         VALUES (?, ?, ?, ?, 'video', ?, ?, ?)`,
        [title, description || "", file_path, thumbnail_path || "", mime_type, status || "pending", created_by]
      );
      videoIds.push(result.insertId);
    }
  }
  return videoIds;
}

async function createOrUpdateDocuments(connection, documents, user_id) {
  if (!Array.isArray(documents) || documents.length === 0) return [];
  const documentIds = [];
  for (const doc of documents) {
    const { id, title, description, file_path, thumbnail_path, mime_type, status } = doc;
    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for document upload");
    }
    if (id) {
      await connection.query(
        `UPDATE document 
         SET title=?, description=?, file_path=?, thumbnail_path=?, mime_type=?, status=?, updated_by=?
         WHERE id=?`,
        [title, description || "", file_path, thumbnail_path || "", mime_type, status || "pending", user_id, id]
      );
      documentIds.push(id);
    } else {
      const [result] = await connection.query(
        `INSERT INTO document 
         (title, description, file_path, thumbnail_path, media_type, mime_type, status, created_by)
         VALUES (?, ?, ?, ?, 'document', ?, ?, ?)`,
        [title, description || "", file_path, thumbnail_path || "", mime_type, status || "pending", user_id]
      );
      documentIds.push(result.insertId);
    }
  }
  return documentIds;
}

/**
 * upsertApprovalsForTribes:
 * For the given content row (contentId), use the provided tribeReferences (expected to be an object
 * with a "value" array) and for each referenced tribe (where associated_table is "tribes"),
 * find that tribe's committee and upsert a content_approval record.
 */
async function upsertApprovalsForTribes(connection, contentId, tribeReferences) {
  if (!tribeReferences || !tribeReferences.value || !Array.isArray(tribeReferences.value)) {
    return;
  }
  for (const ref of tribeReferences.value) {
    if (ref.associated_table === "tribes" && ref.associated_table_id) {
      const tribeId = ref.associated_table_id;
      // Find the committee for this tribe (assumes one committee per tribe)
      const [commRows] = await connection.query(
        `SELECT id FROM committees WHERE tribe_id=? ORDER BY id LIMIT 1`,
        [tribeId]
      );
      if (!commRows.length) {
        continue;
      }
      const committeeId = commRows[0].id;
      // Count committee members to set current_level
      const [cnt] = await connection.query(
        `SELECT COUNT(*) AS member_count FROM committee_members WHERE committee_id=?`,
        [committeeId]
      );
      const committeeMemberCount = cnt[0].member_count || 1;
      // Check if an approval row already exists for this content and committee
      const [checkRows] = await connection.query(
        `SELECT id FROM content_approval WHERE content_id=? AND committee_id=?`,
        [contentId, committeeId]
      );
      if (checkRows.length === 0) {
        // Insert a new approval row
        await connection.query(
          `INSERT INTO content_approval 
           (content_id, committee_id, status, current_level)
           VALUES (?, ?, 'pending', ?)`,
          [contentId, committeeId, committeeMemberCount]
        );
      } else {
        // Reset existing approval row to 'pending' and update current_level
        await connection.query(
          `UPDATE content_approval
           SET status='pending', current_level=?, remarks=NULL
           WHERE id=?`,
          [committeeMemberCount, checkRows[0].id]
        );
      }
    }
  }
}

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

  import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getTribeAttributes(req, res);
    case "POST":
      return createTribeAttributes(req, res);
    case "PATCH":
      return updateTribeAttributes(req, res);
    case "DELETE":
      return deleteTribeAttributes(req, res); // Our unified delete endpoint
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

// ----------------------------------------------------
// 1. GET - List all active tribe attributes
// ----------------------------------------------------
async function getTribeAttributes(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT a.id, a.name, a.description, a.attribute_type_id, tac.is_active
      FROM attributes a
      JOIN tribe_attribute_config tac ON a.id = tac.attribute_id
      WHERE a.name LIKE 'tribe-%' AND tac.is_active = true
      ORDER BY tac.display_order
    `);
    connection.release();
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2. POST - Create new tribe attributes
// ----------------------------------------------------
async function createTribeAttributes(req, res) {
  /*
    Expected JSON body:
    {
      "attributes": [
        { "name": "History of the Tribe", "description": "Historical info...", "is_required": true, attribute_type_id: 1 },
        { "name": "New Attribute", "description": "Some info...", "is_required": false, attribute_type_id: 1 }
      ]
    }
  */

  try {
    let { attributes } = req.body;
    // If attributes is not an array, wrap it in an array
    const attributesArray = Array.isArray(attributes)
      ? attributes
      : [attributes];

    const connection = await pool.getConnection();
    const insertedAttributes = [];

    // Iterate through each attribute object
    for (const attr of attributesArray) {
      const { name, description, is_required, attribute_type_id } = attr;

      // Convert "History of the Tribe" -> "tribe-HistoryOfTheTribe"
      // Using "UppercaseFirstLetterOfEachWord" approach
      const formattedName =
        "tribe-" +
        name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");

      // Insert into the attributes table (assuming attribute_type_id=1 => Text)
      const [result] = await connection.query(
        `INSERT INTO attributes (attribute_type_id, name, description, is_required)
         VALUES (?, ?, ?, ?)`,
        [attribute_type_id, formattedName, description, is_required]
      );
      const attributeId = result.insertId;
      insertedAttributes.push(attributeId);

      // Determine the new display order by checking the current maximum display_order
      const [rowsDisplayOrder] = await connection.query(
        `SELECT IFNULL(MAX(display_order), 0) AS lastOrder FROM tribe_attribute_config`
      );
      const newDisplayOrder = rowsDisplayOrder[0].lastOrder + 1;

      // Insert into tribe_attribute_config with the computed display order
      await connection.query(
        `INSERT INTO tribe_attribute_config (attribute_id, display_order)
         VALUES (?, ?)`,
        [attributeId, newDisplayOrder]
      );
    }

    connection.release();
    return res.status(201).json({
      success: true,
      message: "Tribe attribute(s) created",
      attributeIds: insertedAttributes,
    });
  } catch (error) {
    console.error("Error creating attribute(s):", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 3. PATCH - Update an existing tribe attribute
// ----------------------------------------------------
async function updateTribeAttributes(req, res) {
  /*
    Expected URL query: ?id=attributeId
    Expected JSON body:
    {
      "name": "Updated History",
      "description": "Updated historical info",
      "is_required": false,
      "is_active": false,   // Optional: updates active status in tribe_attribute_config
      "display_order": 3    // Optional: updates display_order in tribe_attribute_config
    }
  */
  try {
    const { id } = req.query;
    const { name, description, is_required, is_active, display_order } =
      req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Attribute ID (id) is required" });
    }

    const connection = await pool.getConnection();

    // Update the attributes table if any of these fields are provided.
    if (name || description !== undefined || is_required !== undefined) {
      let updateQuery = "UPDATE attributes SET ";
      const params = [];

      if (name) {
        const formattedName = "tribe-" + name.replace(/\s+/g, "");
        updateQuery += "name = ?, ";
        params.push(formattedName);
      }
      if (description !== undefined) {
        updateQuery += "description = ?, ";
        params.push(description);
      }
      if (is_required !== undefined) {
        updateQuery += "is_required = ?, ";
        params.push(is_required);
      }

      // Remove trailing comma, space, then add WHERE clause
      updateQuery = updateQuery.slice(0, -2) + " WHERE id = ?";
      params.push(id);

      await connection.query(updateQuery, params);
    }

    // Update the tribe_attribute_config if is_active or display_order is provided.
    const configUpdates = [];
    const configParams = [];

    if (is_active !== undefined) {
      configUpdates.push("is_active = ?");
      configParams.push(is_active);
    }
    if (display_order !== undefined) {
      configUpdates.push("display_order = ?");
      configParams.push(display_order);
    }

    if (configUpdates.length > 0) {
      const updateConfigQuery = `
        UPDATE tribe_attribute_config
        SET ${configUpdates.join(", ")}
        WHERE attribute_id = ?
      `;
      configParams.push(id);
      await connection.query(updateConfigQuery, configParams);
    }

    connection.release();
    return res
      .status(200)
      .json({ success: true, message: "Tribe attribute updated" });
  } catch (error) {
    console.error("Error updating attribute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 4. DELETE - Handle soft vs. hard delete of an attribute
// ----------------------------------------------------
async function deleteTribeAttributes(req, res) {
  /*
    Expected URL query: 
      ?id=attributeId
      &deleteMode=soft    (or)  &deleteMode=hard
    Example: /api/tribe/attributes?id=10&deleteMode=hard
  */
  try {
    const { id } = req.query;
    let { deleteMode } = req.query;
    deleteMode = deleteMode || "soft";

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Attribute ID (id) is required" });
    }

    const connection = await pool.getConnection();

    // If 'deleteMode' is 'hard', remove from both tribe_attribute_config & attributes
    if (deleteMode === "hard") {
      // Also optionally remove content referencing this attribute if required:
      // await connection.query(`DELETE FROM content WHERE attribute_id = ?`, [id]);

      // First remove from config
      await connection.query(
        `DELETE FROM tribe_attribute_config WHERE attribute_id = ?`,
        [id]
      );
      // Then remove from attributes
      await connection.query(`DELETE FROM attributes WHERE id = ?`, [id]);
      connection.release();

      return res.status(200).json({
        success: true,
        message: `Hard deleted attribute ID ${id}`,
      });
    } else {
      // Default: soft delete sets is_active = false in tribe_attribute_config
      await connection.query(
        `UPDATE tribe_attribute_config
         SET is_active = false
         WHERE attribute_id = ?`,
        [id]
      );
      connection.release();
      return res.status(200).json({
        success: true,
        message: `Soft-deleted attribute ID ${id} (is_active = false)`,
      });
    }
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return createTribe(req, res);
    case "GET":
      return getTribes(req, res);
    case "PATCH":
      return updateTribe(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

// ----------------------------------------------------
// 1) POST /api/tribe
// Create a new tribe & optional attributes
// ----------------------------------------------------
async function createTribe(req, res) {
  try {
    const { name, attributes, user_id } = req.body;

    if (!name || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "Name and user_id are required" });
    }

    const connection = await pool.getConnection();

    // Insert tribe
    const [result] = await connection.query(
      `INSERT INTO tribes (name, created_by) VALUES (?, ?)`,
      [name, user_id]
    );

    const tribeId = result.insertId;

    // 2) Create the default approval committee
    const committeeName = `Approval Committee for ${name}`;
    const committeePurpose = `Approve contents for Tribe ${name}`;
    const [commResult] = await connection.query(
      `
          INSERT INTO committees (tribe_id, name, purpose, created_by)
          VALUES (?,?,?,?)`,
      [tribeId, committeeName, committeePurpose, user_id]
    );
    const committeeId = commResult.insertId;

    // 3) Find the user_id's of each default role
    // (assuming your roles table or user records store them)

    const [directorRow] = await connection.query(`
      SELECT id FROM users WHERE role_id=1 LIMIT 1
    `);
    const [deputyRow] = await connection.query(`
      SELECT id FROM users WHERE role_id=2 LIMIT 1
    `);
    const [assistantRow] = await connection.query(`
      SELECT id FROM users WHERE role_id=3 LIMIT 1
    `);
    const [cboRow] = await connection.query(`
      SELECT id FROM users WHERE role_id=4 LIMIT 1
    `);

    const directorId = directorRow.length ? directorRow[0].id : null;
    const deputyId = deputyRow.length ? deputyRow[0].id : null;
    const assistantId = assistantRow.length ? assistantRow[0].id : null;
    const cboMemberId = cboRow.length ? cboRow[0].id : null;

    await connection.query(
      `
        INSERT INTO committee_members
          (committee_id, user_id, hierarchy_level, is_permanent)
        VALUES (?, ?, ?, ?)`,
      [committeeId, directorId, 1, true]
    );

    await connection.query(
      `
        INSERT INTO committee_members
          (committee_id, user_id, hierarchy_level, is_permanent)
        VALUES (?, ?, ?, ?)`,
      [committeeId, deputyId, 2, true]
    );

    await connection.query(
      `
        INSERT INTO committee_members
          (committee_id, user_id, hierarchy_level, is_permanent)
        VALUES (?, ?, ?, ?)`,
      [committeeId, assistantId, 3, true]
    );

    const lastMember = await connection.query(
      `
        INSERT INTO committee_members
          (committee_id, user_id, hierarchy_level, is_permanent)
        VALUES (?, ?, ?, ?)`,
      [committeeId, cboMemberId, 4, true]
    );

    // Inserting into search_index for tribe
    const searchableText = name;
    await connection.query(
      `INSERT INTO search_index (source_type, source_id, searchable_text)
           VALUES (?, ?, ?)`,
      ["tribe", tribeId, searchableText]
    );

    // If we have attribute data, insert it
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (const attr of attributes) {
        // Validate the attribute_value based on attribute_type
        const { errorMsg, validValue } = await validateValue(
          connection,
          attr.attribute_id,
          attr.attribute_value
        );
        if (errorMsg) {
          connection.release();
          return res.status(400).json({
            success: false,
            error: `Validation failed for attribute_id=${attr.attribute_id}: ${errorMsg}`,
          });
        }
        const [contentResult] = await connection.query(
          `INSERT INTO content
           (name, associated_table, associated_table_id, attribute_id, value, created_by)
           VALUES (?, 'tribe', ?, ?, ?, ?)`,
          [
            attr.attribute_name || "",
            tribeId,
            attr.attribute_id,
            JSON.stringify(validValue),
            user_id,
          ]
        );

        const contentId = contentResult.insertId;

        // Insert into content_approval
        await connection.query(
          `
          INSERT INTO content_approval
            (content_id, committee_id, status, current_level)
          VALUES (?, ?, 'pending', 4)
        `,
          [contentId, committeeId]
        );
      }
    }

    connection.release();
    return res.status(201).json({
      success: true,
      message: "Tribe created successfully",
      data: { tribeId },
    });
  } catch (error) {
    console.error("Error creating tribe:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2) GET /api/tribe
// Fetch all tribes & attributes
// ----------------------------------------------------
async function getTribes(req, res) {
  try {
    const connection = await pool.getConnection();
    // All tribes
    const [tribes] = await connection.query(
      "SELECT id AS tribe_id, name FROM tribes"
    );

    if (tribes.length === 0) {
      connection.release();
      return res.status(200).json({ success: true, data: [] });
    }

    // Attributes
    const [attrs] = await connection.query(`
      SELECT 
        c.associated_table_id AS tribe_id,
        c.attribute_id,
        a.name AS attribute_name,
        a.description AS attribute_description,
        a.attribute_type_id,
        c.value AS attribute_value
      FROM content c
      JOIN attributes a ON c.attribute_id = a.id
      WHERE c.associated_table = 'tribe'
    `);

    connection.release();

    // Merge into tribeMap
    const tribeMap = {};
    tribes.forEach((t) => {
      tribeMap[t.tribe_id] = {
        tribe_id: t.tribe_id,
        name: t.name,
        attributes: [],
      };
    });

    attrs.forEach((r) => {
      let parsed;
      if (typeof r.attribute_value === "string") {
        try {
          parsed = JSON.parse(r.attribute_value);
        } catch (e) {
          parsed = r.attribute_value;
        }
      } else {
        parsed = r.attribute_value;
      }

      tribeMap[r.tribe_id].attributes.push({
        attribute_id: r.attribute_id,
        attribute_name: r.attribute_name,
        attribute_description: r.attribute_description,
        attribute_type_id: r.attribute_type_id,
        attribute_value: parsed,
      });
    });

    return res.status(200).json({
      success: true,
      data: Object.values(tribeMap),
    });
  } catch (error) {
    console.error("Error fetching tribes:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 3) PATCH /api/tribe
// Add or update attribute content for an existing tribe
// ----------------------------------------------------
async function updateTribe(req, res) {
  try {
    const { name, tribe_id, attributes, user_id } = req.body;

    if (!tribe_id || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "Tribe ID and user_id are required" });
    }

    const connection = await pool.getConnection();

    // Confirm tribe existence
    const [tribeCheck] = await connection.query(
      "SELECT id FROM tribes WHERE id = ?",
      [tribe_id]
    );
    if (tribeCheck.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: "Tribe not found" });
    }

    // Update tribe name
    if (name) {
      updateTribeName(connection, tribe_id, name);
    }

    // 3) Retrieve the single committee for this tribe
    const [commRows] = await connection.query(
      "SELECT id FROM committees WHERE tribe_id=? ORDER BY id LIMIT 1",
      [tribe_id]
    );
    let committeeId = null;
    let committeeMemberCount = 0;

    if (commRows.length > 0) {
      committeeId = commRows[0].id;

      // Get the number of members in the committee
      const [memberCountResult] = await connection.query(
        "SELECT COUNT(*) as member_count FROM committee_members WHERE committee_id=?",
        [committeeId]
      );
      committeeMemberCount = memberCountResult[0].member_count || 4; // Default to 1 if no members
    }

    console.log("commmittees data", commRows);

    // Insert or update each attribute
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (const {
        attribute_id,
        attribute_name,
        attribute_value,
      } of attributes) {
        // Validate shape
        const { errorMsg, validValue } = await validateValue(
          connection,
          attribute_id,
          attribute_value
        );
        if (errorMsg) {
          connection.release();
          return res.status(400).json({
            success: false,
            error: `Validation failed for attribute_id=${attribute_id}: ${errorMsg}`,
          });
        }

        const strValue = JSON.stringify(validValue);

        // Check if row already exists
        const [existingRow] = await connection.query(
          `SELECT id FROM content
           WHERE associated_table='tribe'
             AND associated_table_id=?
             AND attribute_id=?`,
          [tribe_id, attribute_id]
        );

        console.log("existingRow", existingRow);

        let contentId = null;

        if (existingRow.length === 0) {
          // Insert a new content row
          const [insertResult] = await connection.query(
            `INSERT INTO content
               (name, associated_table, associated_table_id, attribute_id, status, value, created_by)
             VALUES (?, 'tribe', ?, ?, 'pending', ?, ?)`,
            [attribute_name || "", tribe_id, attribute_id, strValue, user_id]
          );
          contentId = insertResult.insertId;
        } else {
          // Update existing row; reset status to "pending"
          contentId = existingRow[0].id;
          await connection.query(
            `UPDATE content
               SET value=?, updated_by=?, status='pending'
             WHERE id=?`,
            [strValue, user_id, contentId]
          );
        }

        // 5) Upsert "content_approval" if a committee exists
        if (committeeId) {
          // Check if there's an approval row for (contentId, committeeId)
          const [approvalCheck] = await connection.query(
            `SELECT id, status
                     FROM content_approval
                     WHERE content_id=? AND committee_id=?`,
            [contentId, committeeId]
          );

          if (approvalCheck.length === 0) {
            // Insert new pending approval
            await connection.query(
              `INSERT INTO content_approval
                        (content_id, committee_id, status, current_level)
                       VALUES (?, ?, 'pending', ?)`,
              [contentId, committeeId, committeeMemberCount]
            );
          } else {
            // Reset existing to 'pending', clear remarks if needed
            await connection.query(
              `UPDATE content_approval
                       SET status='pending', current_level=?, remarks=NULL
                       WHERE content_id=? AND committee_id=?`,
              [committeeMemberCount, contentId, committeeId]
            );
          }
        }
      }
    }

    connection.release();
    return res.status(200).json({
      success: true,
      message: "Tribe details updated successfully",
    });
  } catch (error) {
    console.error("Error updating tribe:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// validateValue( connection, attribute_id, userValue )
//  -> { errorMsg, validValue }
// ----------------------------------------------------
async function validateValue(connection, attribute_id, userValue) {
  /*
    Steps:
     1) Find attribute_type_id from attributes
     2) Retrieve value_structure from attribute_types
     3) Check shape vs. "example"
  */

  // 1) Query attribute info
  const [attrRows] = await connection.query(
    `SELECT a.attribute_type_id, at.value_structure
     FROM attributes a
     JOIN attribute_types at ON a.attribute_type_id = at.id
     WHERE a.id = ?`,
    [attribute_id]
  );

  if (!attrRows.length) {
    return {
      errorMsg: `Attribute ID=${attribute_id} not found in 'attributes' table.`,
      validValue: userValue,
    };
  }

  const { attribute_type_id, value_structure } = attrRows[0];
  if (!value_structure) {
    // No structure => no deep validation
    return { errorMsg: null, validValue: userValue };
  }

  let parsedStruct;
  try {
    parsedStruct = JSON.parse(value_structure); // e.g., { type: "normalText", example: { value: "String" } }
  } catch (e) {
    // Malformed value_structure => skip
    return { errorMsg: null, validValue: userValue };
  }

  // 2) Minimal shape checking
  const structType = parsedStruct.type || "";
  switch (structType) {
    case "normalText":
      if (typeof userValue?.value !== "string") {
        return {
          errorMsg: "Expected { value: <string> } for normalText",
          validValue: userValue,
        };
      }
      break;

    case "mediaStorage":
      if (!userValue?.files || !Array.isArray(userValue.files)) {
        return {
          errorMsg: "Expected { files: [...] } for mediaStorage",
          validValue: userValue,
        };
      }
      // You could further check each file item if needed.
      break;

    case "normalArray":
      if (!Array.isArray(userValue?.value)) {
        return {
          errorMsg: "Expected { value: [] } for normalArray",
          validValue: userValue,
        };
      }
      break;

    case "dateValue":
      if (typeof userValue?.value !== "string") {
        return {
          errorMsg: "Expected { value: 'YYYY-MM-DD' } for dateValue",
          validValue: userValue,
        };
      }
      // Optionally validate the date format.
      break;

    case "numberValue":
      if (typeof userValue?.value !== "number") {
        return {
          errorMsg: "Expected { value: number } for numberValue",
          validValue: userValue,
        };
      }
      break;

    case "booleanValue":
      if (typeof userValue?.value !== "boolean") {
        return {
          errorMsg: "Expected { value: true/false } for booleanValue",
          validValue: userValue,
        };
      }
      break;

    case "relationsToOtherTables":
      if (!Array.isArray(userValue?.value)) {
        return {
          errorMsg: "Expected { value: [...] } referencing other tables",
          validValue: userValue,
        };
      }
      // You might check that each item has "associated_table", "associated_table_id", etc.
      break;

    default:
    // If there's no recognized type, skip or accept.
  }

  // If we get here, no error => everything is good
  return { errorMsg: null, validValue: userValue };
}

async function updateTribeName(connection, tribeId, newName) {
  await connection.query(`UPDATE tribes SET name=? WHERE id=?`, [
    newName,
    tribeId,
  ]);
  // Update search_index
  await connection.query(
    `UPDATE search_index
     SET searchable_text=?
     WHERE source_type='tribe' AND source_id=?`,
    [newName, tribeId]
  );
}
