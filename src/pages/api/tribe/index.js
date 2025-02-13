import pool from "../../../utils/db";
import processMediaAttributes from "../../../utils/processMediaAttribute";
import processMediaIfNeeded from '../../../utils/processMedia'

// *** If you have a local "attributeTypes" import, do it here.
// import attributeTypes from "../../../utils/attributeTypes"; // optional

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

    // 1) Insert the new tribe
    const [tribeResult] = await connection.query(
      `INSERT INTO tribes (name, created_by) VALUES (?, ?)`,
      [name, user_id]
    );
    const tribeId = tribeResult.insertId;

    // 2) Create the default approval committee for this tribe
    const committeeName = `Approval Committee for ${name}`;
    const committeePurpose = `Approve contents for Tribe ${name}`;
    const [commResult] = await connection.query(
      `INSERT INTO committees (tribe_id, name, purpose, created_by)
       VALUES (?,?,?,?)`,
      [tribeId, committeeName, committeePurpose, user_id]
    );
    const committeeId = commResult.insertId;

    // 3) Optionally: find default roles => add committee members
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
      `INSERT INTO committee_members
       (committee_id, user_id, hierarchy_level, is_permanent)
       VALUES (?, ?, ?, ?)`,
      [committeeId, directorId, 1, true]
    );
    await connection.query(
      `INSERT INTO committee_members
       (committee_id, user_id, hierarchy_level, is_permanent)
       VALUES (?, ?, ?, ?)`,
      [committeeId, deputyId, 2, true]
    );
    await connection.query(
      `INSERT INTO committee_members
       (committee_id, user_id, hierarchy_level, is_permanent)
       VALUES (?, ?, ?, ?)`,
      [committeeId, assistantId, 3, true]
    );
    await connection.query(
      `INSERT INTO committee_members
       (committee_id, user_id, hierarchy_level, is_permanent)
       VALUES (?, ?, ?, ?)`,
      [committeeId, cboMemberId, 4, true]
    );

    // 4) Insert into search_index for tribe
    const searchableText = name;
    await connection.query(
      `INSERT INTO search_index (source_type, source_id, searchable_text)
       VALUES (?, ?, ?)`,
      ["tribe", tribeId, searchableText]
    );

    // 5) If we have attribute data, process & insert it
    if (Array.isArray(attributes) && attributes.length > 0) {
      // get committee member count for content_approval
      const [memberCountResult] = await connection.query(
        "SELECT COUNT(*) as member_count FROM committee_members WHERE committee_id=?",
        [committeeId]
      );
      const committeeMemberCount = memberCountResult[0].member_count || 1;

      for (const attr of attributes) {
        // Step A: Validate shape vs. attribute_type
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

        // Step B: If attribute is media type (8,9,10), handle media storage
        const storedValue = await processMediaIfNeeded(
          connection,
          attr.attribute_type_id,
          validValue,
          user_id
        );

        // Insert into content
        const [contentResult] = await connection.query(
          `INSERT INTO content
           (name, associated_table, associated_table_id, attribute_id, value, created_by)
           VALUES (?, 'tribe', ?, ?, ?, ?)`,
          [
            attr.attribute_name || "",
            tribeId,
            attr.attribute_id,
            JSON.stringify(storedValue),
            user_id,
          ]
        );
        const contentId = contentResult.insertId;

        // Insert into content_approval => status='pending'
        await connection.query(
          `INSERT INTO content_approval
           (content_id, committee_id, status, current_level)
           VALUES (?, ?, 'pending', ?)`,
          [contentId, committeeId, committeeMemberCount]
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
  let connection;
  try {
    connection = await pool.getConnection();
    // 1) Fetch all tribes
    const [tribes] = await connection.query(
      "SELECT id AS tribe_id, name FROM tribes"
    );
    if (tribes.length === 0) {
      connection.release();
      return res.status(200).json({ success: true, data: [] });
    }

    // 2) Fetch all attributes for these tribes
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

    // 3) Merge attributes into a map of tribe_id => { tribe_id, name, attributes: [...] }
    const tribeMap = {};
    for (const t of tribes) {
      tribeMap[t.tribe_id] = {
        tribe_id: t.tribe_id,
        name: t.name,
        attributes: [],
      };
    }

    // Group attributes by tribe_id for batch processing
    const tribeAttributes = {};
    for (const r of attrs) {
      let parsedValue;
      if (typeof r.attribute_value === "string") {
        try {
          parsedValue = JSON.parse(r.attribute_value);
        } catch (e) {
          parsedValue = r.attribute_value;
        }
      } else {
        parsedValue = r.attribute_value;
      }

      const attribute = {
        attribute_id: r.attribute_id,
        attribute_name: r.attribute_name,
        attribute_description: r.attribute_description,
        attribute_type_id: r.attribute_type_id,
        attribute_value: parsedValue,
      };

      if (!tribeAttributes[r.tribe_id]) {
        tribeAttributes[r.tribe_id] = [];
      }
      tribeAttributes[r.tribe_id].push(attribute);
    }

    // Process media attributes for each tribe
    for (const tribeId in tribeAttributes) {
      const processedAttributes = await processMediaAttributes(connection, tribeAttributes[tribeId]);
      tribeMap[tribeId].attributes = processedAttributes;
    }

    // 4) Return as array
    const response = {
      success: true,
      data: Object.values(tribeMap),
    };

    connection.release();
    return res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching tribes:", error);
    if (connection) connection.release();
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

    // 1) Confirm tribe existence
    const [tribeCheck] = await connection.query(
      "SELECT id FROM tribes WHERE id = ?",
      [tribe_id]
    );
    if (tribeCheck.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        error: "Tribe not found"
      });
    }

    // 2) Update tribe name (optional)
    if (name) {
      await updateTribeName(connection, tribe_id, name);
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
      // Count members
      const [memberCountResult] = await connection.query(
        "SELECT COUNT(*) as member_count FROM committee_members WHERE committee_id=?",
        [committeeId]
      );
      committeeMemberCount = memberCountResult[0].member_count || 1;
    }

    // 4) Insert or update each attribute
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (const { attribute_id, attribute_name, attribute_value, attribute_type_id } of attributes) {
        // Step A: Validate shape
        const { errorMsg, validValue } = await validateValue(
          connection,
          attribute_id,
          attribute_value
        );
        if (errorMsg) {
          connection.release();
          return res.status(400).json({
            success: false,
            error: `Validation failed for attribute_id=${attribute_id}: ${errorMsg}`
          });
        }

        // Step B: Possibly handle media
        const storedValue = await processMediaIfNeeded(
          connection,
          attribute_type_id,
          validValue,
          user_id
        );

        const strValue = JSON.stringify(storedValue);

        // Step C: Check if content row already exists
        const [existingRow] = await connection.query(
          `SELECT id FROM content
           WHERE associated_table='tribe'
             AND associated_table_id=?
             AND attribute_id=?`,
          [tribe_id, attribute_id]
        );

        let contentId;
        if (existingRow.length === 0) {
          // Insert new => status='pending'
          const [insertResult] = await connection.query(
            `INSERT INTO content
               (name, associated_table, associated_table_id, attribute_id, status, value, created_by)
             VALUES (?, 'tribe', ?, ?, 'pending', ?, ?)`,
            [attribute_name || "", tribe_id, attribute_id, strValue, user_id]
          );
          contentId = insertResult.insertId;
        } else {
          // Update existing => reset status='pending'
          contentId = existingRow[0].id;
          await connection.query(
            `UPDATE content
               SET value=?, updated_by=?, status='pending'
             WHERE id=?`,
            [strValue, user_id, contentId]
          );
        }

        // Step D: Upsert "content_approval" if we have a committee
        if (committeeId) {
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
            // Reset existing to 'pending'
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
      message: "Tribe details updated successfully"
    });
  } catch (error) {
    console.error("Error updating tribe:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// validateValue(connection, attribute_id, userValue)
//  -> { errorMsg, validValue }
// ----------------------------------------------------
async function validateValue(connection, attribute_id, userValue) {
  /*
    1) Find attribute_type_id from attributes
    2) Retrieve value_structure from attribute_types
    3) Check shape vs. "example"
  */
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
      validValue: userValue
    };
  }

  const { attribute_type_id, value_structure } = attrRows[0];
  if (!value_structure) {
    // No structure => no deep validation
    return { errorMsg: null, validValue: userValue };
  }

  let parsedStruct;
  try {
    parsedStruct = JSON.parse(value_structure); 
    // e.g. { "type": "normalText", "example": {"value": "String"} }
  } catch (e) {
    // Malformed
    return { errorMsg: null, validValue: userValue };
  }

  const structType = parsedStruct.type || "";
  // minimal shape checking:
  switch (structType) {
    case "normalText":
      if (typeof userValue?.value !== "string") {
        return {
          errorMsg: "Expected { value: <string> } for normalText",
          validValue: userValue
        };
      }
      break;
    case "normalArray":
      if (!Array.isArray(userValue?.value)) {
        return {
          errorMsg: "Expected { value: [] } for normalArray",
          validValue: userValue
        };
      }
      break;
    case "dateValue":
      if (typeof userValue?.value !== "string") {
        return {
          errorMsg: "Expected { value: 'YYYY-MM-DD' } for dateValue",
          validValue: userValue
        };
      }
      break;
    case "numberValue":
      if (typeof userValue?.value !== "number") {
        return {
          errorMsg: "Expected { value: number } for numberValue",
          validValue: userValue
        };
      }
      break;
    case "booleanValue":
      if (typeof userValue?.value !== "boolean") {
        return {
          errorMsg: "Expected { value: true/false } for booleanValue",
          validValue: userValue
        };
      }
      break;
    case "mediaStorage":
      // e.g. { files: [ { url, type, ... } ] }
      if (!userValue?.files || !Array.isArray(userValue.files)) {
        return {
          errorMsg: "Expected { files: [...] } for mediaStorage",
          validValue: userValue
        };
      }
      break;
    case "relationsToOtherTables":
      if (!Array.isArray(userValue?.value)) {
        return {
          errorMsg: "Expected { value: [...] } referencing other tables",
          validValue: userValue
        };
      }
      break;
    default:
      // if no recognized type => skip
  }

  return { errorMsg: null, validValue: userValue };
}


// ----------------------------------------------------
// createOrUpdateDocuments => modifies document table
// ----------------------------------------------------
async function createOrUpdateDocuments(connection, documents, user_id) {
  if (!Array.isArray(documents) || documents.length === 0) return [];
  const documentIds = [];

  for (const doc of documents) {
    const { id, title, description, file_path, thumbnail_path, mime_type, status } = doc;
    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for document upload");
    }

    if (id) {
      // update existing
      await connection.query(
        `UPDATE document
         SET title=?, description=?, file_path=?, thumbnail_path=?,
             mime_type=?, status=?, updated_by=?
         WHERE id=?`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          user_id,
          id
        ]
      );
      documentIds.push(id);
    } else {
      // create new
      const [result] = await connection.query(
        `INSERT INTO document
         (title, description, file_path, thumbnail_path,
          media_type, mime_type, status, created_by)
         VALUES (?, ?, ?, ?, 'document', ?, ?, ?)`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          user_id
        ]
      );
      documentIds.push(result.insertId);
    }
  }
  return documentIds;
}

// ----------------------------------------------------
// updateTribeName => updates tribe name & search_index
// ----------------------------------------------------
async function updateTribeName(connection, tribeId, newName) {
  await connection.query(
    `UPDATE tribes SET name=? WHERE id=?`,
    [newName, tribeId]
  );
  // Also update search index
  await connection.query(
    `UPDATE search_index
     SET searchable_text=?
     WHERE source_type='tribe' AND source_id=?`,
    [newName, tribeId]
  );
}