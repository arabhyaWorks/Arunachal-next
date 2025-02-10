-- Creating Category attributes


-- First, let's add these attributes to the attributes table
INSERT INTO attributes (attribute_type_id, name, description, is_required, metadata) VALUES
-- Using attribute_type_id=3 for Array type
(3, 'Tribes', 'Associated tribes for the music piece', true, '{"type": "array", "items": "tribe_id"}'),
-- Using attribute_type_id=1 for Text type
(1, 'Title', 'Title of the music piece', true, NULL),
(1, 'Variation', 'Variations of the music piece', false, NULL),
(1, 'Composer', 'Composer, Artist, or Performer of the music piece', true, NULL),
-- Using attribute_type_id=3 for Array type (for multiple genres)
(3, 'Genre', 'Genre of the music piece (e.g., ballad, lullaby)', true, '{"type": "array", "items": "string"}'),
(1, 'Duration', 'Duration of the music piece', true, NULL),
-- Using attribute_type_id=3 for Array type (for multiple instruments)
(3, 'Instruments', 'Instruments used in the music piece', true, '{"type": "array", "items": "string"}'),
(1, 'Region', 'Region or Cultural Origin', true, NULL),
(1, 'SocialSignificance', 'Social or cultural Significance', true, NULL),
(1, 'HistoricalContext', 'Historical/religious context and significance', true, NULL);

-- Now let's associate these attributes with the Folk Music category
-- First, get the Folk Music category ID
SET @folk_music_id = (SELECT id FROM categories WHERE name = 'Folk Music' LIMIT 1);

-- Now insert the category attributes with sample JSON values
INSERT INTO category_attributes (category_id, attribute_id, value)
SELECT 
    @folk_music_id,
    id,
    CASE 
        WHEN name = 'Tribes' THEN '{"type": "normalArray", "data": {"label": "Associated Tribes", "value": []}}'
        WHEN name = 'Title' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'Variation' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'Composer' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'Genre' THEN '{"type": "normalArray", "data": {"label": "Music Genres", "value": []}}'
        WHEN name = 'Duration' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'Instruments' THEN '{"type": "normalArray", "data": {"label": "Instruments Used", "value": []}}'
        WHEN name = 'Region' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'SocialSignificance' THEN '{"type": "normalText", "data": ""}'
        WHEN name = 'HistoricalContext' THEN '{"type": "normalText", "data": ""}'
    END as value
FROM attributes 
WHERE id IN (
    SELECT id FROM attributes 
    WHERE name IN ('Tribes', 'Title', 'Variation', 'Composer', 'Genre', 'Duration', 'Instruments', 'Region', 'SocialSignificance', 'HistoricalContext')
);

-- Let's verify the attributes were added correctly
SELECT 
    c.name as category_name,
    a.name as attribute_name,
    a.description,
    ca.value
FROM categories c
JOIN category_attributes ca ON c.id = ca.category_id
JOIN attributes a ON ca.attribute_id = a.id
WHERE c.name = 'Folk Music'
ORDER BY a.id;