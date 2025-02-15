// ----------------------------------------------------
// processMediaIfNeeded => if attribute_type_id in (8=Audio,9=Video,10=Doc,11=AdvanceImage),
// ----------------------------------------------------
async function processMediaIfNeeded(
  connection,
  attribute_type_id,
  attribute_value,
  user_id,
  associated_tribe_id,
  associated_category_id,
  associated_category_item_id
) {
  let storedValue = attribute_value;

  console.log(
    associated_tribe_id,
    associated_category_id,
    associated_category_item_id
  );

  if (attribute_type_id === 8) {
    // Audio
    const updatedAudioIds = await createOrUpdateAudio(
      connection,
      attribute_value,
      user_id,
      associated_tribe_id,
      associated_category_id,
      associated_category_item_id
    );
    storedValue = { value: updatedAudioIds };
  } else if (attribute_type_id === 9) {
    console.log("Processing Video");
    // Video
    const updatedVideoIds = await createOrUpdateVideos(
      connection,
      attribute_value,
      associated_tribe_id,
      associated_category_id,
      associated_category_item_id
    );
    storedValue = { value: updatedVideoIds };
  } else if (attribute_type_id === 10) {
    // Document
    const updatedDocIds = await createOrUpdateDocuments(
      connection,
      attribute_value,
      user_id,
      associated_tribe_id,
      associated_category_id,
      associated_category_item_id
    );
    storedValue = { value: updatedDocIds };
  } else if (attribute_type_id === 11) {
    console.log("Processing Advance Image");
    // Advanced Image
    const updatedImageIds = await createOrUpdateAdvanceImages(
      connection,
      attribute_value,
      user_id,
      associated_tribe_id,
      associated_category_id,
      associated_category_item_id
    );
    storedValue = { value: updatedImageIds };
  }

  return storedValue;
}

// ----------------------------------------------------
// createOrUpdateAudio => modifies audio table
// ----------------------------------------------------
async function createOrUpdateAudio(
  connection,
  audioData,
  user_id,
  associated_tribe_id,
  associated_category_id,
  associated_category_item_id
) {
  if (!Array.isArray(audioData) || audioData.length === 0) return [];
  const audioIds = [];

  for (const audio of audioData) {
    const {
      id,
      title,
      description,
      file_path,
      thumbnail_path,
      lyrics,
      genre,
      composer,
      performers,
      instruments,
      mime_type,
    } = audio;

    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for audio upload");
    }

    if (id) {
      // update existing
      await connection.query(
        `UPDATE audio 
           SET title=?, description=?, file_path=?, thumbnail_path=?, lyrics=?,
               genre=?, composer=?, performers=?, instruments=?, mime_type=?, 
               associated_tribe_id=?, associated_category_id=?, associated_category_item_id=?,
               updated_by=?
           WHERE id=?`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          lyrics || "",
          JSON.stringify(genre || []),
          composer || "",
          JSON.stringify(performers || []),
          JSON.stringify(instruments || []),
          mime_type,
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
          id,
        ]
      );
      audioIds.push(id);
    } else {
      // create new
      const [result] = await connection.query(
        `INSERT INTO audio 
           (title, description, file_path, thumbnail_path, lyrics, genre,
            composer, performers, instruments, mime_type, 
            associated_tribe_id, associated_category_id, associated_category_item_id,
            created_by)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          lyrics || "",
          JSON.stringify(genre || []),
          composer || "",
          JSON.stringify(performers || []),
          JSON.stringify(instruments || []),
          mime_type,
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
        ]
      );
      audioIds.push(result.insertId);
    }
  }
  return audioIds;
}

// ----------------------------------------------------
// createOrUpdateVideos => modifies video table
// ----------------------------------------------------
async function createOrUpdateVideos(
  connection,
  videos,
  associated_tribe_id,
  associated_category_id,
  associated_category_item_id
) {
  if (!Array.isArray(videos) || videos.length === 0) return [];
  const videoIds = [];

  console.log("handling videos", videos);

  for (const video of videos) {
    const {
      id,
      title,
      description,
      file_path,
      thumbnail_path,
      mime_type,
      created_by,
      status,
    } = video;

    if (!title || !file_path || !mime_type || !created_by) {
      throw new Error("Missing required fields for video upload");
    }

    if (id) {
      // update existing
      await connection.query(
        `UPDATE video
           SET title=?, description=?, file_path=?, thumbnail_path=?,
               mime_type=?, status=?, associated_tribe_id=?, 
               associated_category_id=?, associated_category_item_id=?,
               updated_by=?
           WHERE id=?`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          created_by,
          id,
        ]
      );
      videoIds.push(id);
    } else {
      // new
      const [result] = await connection.query(
        `INSERT INTO video
           (title, description, file_path, thumbnail_path, media_type,
            mime_type, status, associated_tribe_id, associated_category_id,
            associated_category_item_id, created_by)
           VALUES (?, ?, ?, ?, 'video', ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          created_by,
        ]
      );
      videoIds.push(result.insertId);
    }
  }

  console.log("videoIds", videoIds);
  return videoIds;
}

// ----------------------------------------------------
// createOrUpdateDocuments => modifies document table
// ----------------------------------------------------
async function createOrUpdateDocuments(
  connection,
  documents,
  user_id,
  associated_tribe_id,
  associated_category_id,
  associated_category_item_id
) {
  if (!Array.isArray(documents) || documents.length === 0) return [];
  const documentIds = [];

  for (const doc of documents) {
    const {
      id,
      title,
      description,
      file_path,
      thumbnail_path,
      mime_type,
      status,
    } = doc;

    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for document upload");
    }

    if (id) {
      // update existing
      await connection.query(
        `UPDATE document
           SET title=?, description=?, file_path=?, thumbnail_path=?,
               mime_type=?, status=?, associated_tribe_id=?,
               associated_category_id=?, associated_category_item_id=?,
               updated_by=?
           WHERE id=?`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
          id,
        ]
      );
      documentIds.push(id);
    } else {
      // create new
      const [result] = await connection.query(
        `INSERT INTO document
           (title, description, file_path, thumbnail_path,
            media_type, mime_type, status, associated_tribe_id,
            associated_category_id, associated_category_item_id, created_by)
           VALUES (?, ?, ?, ?, 'document', ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || "",
          file_path,
          thumbnail_path || "",
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
        ]
      );
      documentIds.push(result.insertId);
    }
  }
  return documentIds;
}

// ----------------------------------------------------
// createOrUpdateAdvanceImages => modifies image table
// ----------------------------------------------------
async function createOrUpdateAdvanceImages(
  connection,
  images,
  user_id,
  associated_tribe_id,
  associated_category_id,
  associated_category_item_id
) {
  console.log("images", images);

  if (!Array.isArray(images) || images.length === 0) return [];

  console.log("images", images);

  const imageIds = [];

  for (const image of images) {
    const { id, title, description, file_path, mime_type, status } = image;

    if (!title || !file_path || !mime_type || !user_id) {
      throw new Error("Missing required fields for image upload");
    }

    if (id) {
      // update existing
      await connection.query(
        `UPDATE image
           SET title=?, description=?, file_path=?,
               mime_type=?, status=?, associated_tribe_id=?,
               associated_category_id=?, associated_category_item_id=?,
               updated_by=?
           WHERE id=?`,
        [
          title,
          description || "",
          file_path,
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
          id,
        ]
      );
      imageIds.push(id);
    } else {
      // create new
      const [result] = await connection.query(
        `INSERT INTO image
           (title, description, file_path,
            media_type, mime_type, status, associated_tribe_id,
            associated_category_id, associated_category_item_id, created_by)
           VALUES (?, ?, ?, 'image', ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || "",
          file_path,
          mime_type,
          status || "pending",
          associated_tribe_id || null,
          associated_category_id || null,
          associated_category_item_id || null,
          user_id,
        ]
      );
      imageIds.push(result.insertId);
    }
  }
  return imageIds;
}

export default processMediaIfNeeded;
