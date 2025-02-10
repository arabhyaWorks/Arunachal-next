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