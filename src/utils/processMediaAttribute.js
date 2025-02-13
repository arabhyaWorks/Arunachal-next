function getTableNameByAttributeTypeId(attributeTypeId) {
  switch (attributeTypeId) {
    case 8:
      return 'audio';
    case 9:
      return 'video';
    case 10:
      return 'document';
    case 11:
      return 'image';
    default:
      return null;
  }
}

async function processMediaAttributes(connection, attributes) {
  const processedAttributes = [];

  for (const attr of attributes) {
    let processedAttr = { ...attr };

    if ([8, 9, 10, 11].includes(attr.attribute_type_id)) {
      try {
        let parsedValue = attr.attribute_value;
        if (typeof parsedValue === "string") {
          parsedValue = JSON.parse(parsedValue);
        }

        // Get the media IDs
        const mediaIds = parsedValue.value;
        if (!Array.isArray(mediaIds)) {
          continue;
        }

        // Get the table name
        const tableName = getTableNameByAttributeTypeId(attr.attribute_type_id);
        if (!tableName) {
          continue;
        }

        // Fetch media details
        const [mediaDetails] = await connection.query(
          `SELECT 
            id,
            title,
            description,
            associated_tribe_id,
            associated_category_id,
            associated_category_item_id,
            file_path,
            ${tableName === 'audio' ? 'thumbnail_path, lyrics, genre, composer, performers, instruments,' : ''}
            ${['video', 'document'].includes(tableName) ? 'thumbnail_path,' : ''}
            media_type,
            mime_type,
            status,
            created_at,
            updated_at,
            created_by,
            updated_by
          FROM ${tableName}
          WHERE id IN (?)`,
          [mediaIds]
        );

        // Transform the result based on media type
        const transformedMedia = mediaDetails.map(item => {
          const baseMedia = {
            id: item.id,
            title: item.title,
            description: item.description,
            associated_tribe_id: item.associated_tribe_id,
            associated_category_id: item.associated_category_id,
            associated_category_item_id: item.associated_category_item_id,
            file_path: item.file_path,
            media_type: item.media_type,
            mime_type: item.mime_type,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            created_by: item.created_by,
            updated_by: item.updated_by
          };

          // Add media-specific fields
          if (tableName === 'audio') {
            return {
              ...baseMedia,
              thumbnail_path: item.thumbnail_path,
              lyrics: item.lyrics,
              genre: item.genre ? JSON.parse(item.genre) : null,
              composer: item.composer,
              performers: item.performers ? JSON.parse(item.performers) : null,
              instruments: item.instruments ? JSON.parse(item.instruments) : null
            };
          } else if (['video', 'document'].includes(tableName)) {
            return {
              ...baseMedia,
              thumbnail_path: item.thumbnail_path
            };
          }

          return baseMedia;
        });

        // Update the attribute value
        processedAttr.attribute_value = {
          value: transformedMedia
        };
      } catch (error) {
        console.error(`Error processing media attribute: ${error.message}`);
        // Keep the original attribute value if there's an error
      }
    }

    processedAttributes.push(processedAttr);
  }

  return processedAttributes;
}

export default processMediaAttributes;