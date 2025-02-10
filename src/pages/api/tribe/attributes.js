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

// okay thik hai jo hamari problem this ki jab user nya attribute create karega to stucture ka kaise hoga, wo hamara attribute type se define hoga aur usme emamples bhi hain ki content table value field ke andar kaisa data jana chahiye so lets get back to the api development
