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
