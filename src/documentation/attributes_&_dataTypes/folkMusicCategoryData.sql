-- Example: Adding a sample folk music entry
-- First, let's get the Folk Music category ID
SET @folk_music_id = (SELECT id FROM categories WHERE name = 'Folk Music' LIMIT 1);

-- Let's say we have tribe IDs 1 and 2
-- Update the "Tribes" attribute
UPDATE category_attributes 
SET value = '{
    "type": "normalArray",
    "data": {
        "label": "Associated Tribes",
        "value": [1, 2]
    }
}'
WHERE category_id = @folk_music_id 
AND attribute_id = (SELECT id FROM attributes WHERE name = 'Tribes');

-- Update the "Title" attribute
UPDATE category_attributes 
SET value = '{
    "type": "normalText",
    "data": "Traditional Harvest Song"
}'
WHERE category_id = @folk_music_id 
AND attribute_id = (SELECT id FROM attributes WHERE name = 'Title');

-- Update other attributes similarly...

-- Verify the entry
SELECT a.name, ca.value
FROM category_attributes ca
JOIN attributes a ON ca.attribute_id = a.id
WHERE ca.category_id = @folk_music_id;