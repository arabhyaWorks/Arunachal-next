-- -- 1. First create Folk Music category
-- INSERT INTO categories (name, description) VALUES 
-- ('Folk Music', 'Traditional folk music of tribes');
SET @folk_music_id = 1;

-- -- 2. Create basic attributes for Folk Music category
-- INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
-- (1, 'categoryName', 'Name of category', true),
-- (1, 'categoryDescription', 'Description of category', true),
-- (3, 'categoryTribeAssociation', 'Associated tribes', true),
-- (1, 'categoryGenre', 'Genre of the music', true),
-- (3, 'categoryInstruments', 'Traditional instruments used', true),
-- (1, 'categoryDuration', 'Duration of the piece', false),
-- (1, 'categoryContext', 'Cultural and historical context', true);

-- -- 3. Add content for Folk Music category
-- INSERT INTO content (name, associated_table, associated_table_id, attribute_id, value) VALUES
-- ('Folk Music Name', 'category', @folk_music_id,
--  (SELECT id FROM attributes WHERE name = 'categoryName'),
--  '{"type": "normalText", "data": "Folk Music"}'),

-- ('Folk Music Description', 'category', @folk_music_id,
--  (SELECT id FROM attributes WHERE name = 'categoryDescription'),
--  '{"type": "normalText", "data": "Traditional folk music representing cultural heritage through songs and melodies"}'),

-- ('Folk Music Tribes', 'category', @folk_music_id,
--  (SELECT id FROM attributes WHERE name = 'categoryTribeAssociation'),
--  '{"type": "normalArray", "data": {"label": "Associated Tribes", "value": ["Adi", "Apatani", "Nyishi"]}}'),

-- ('Folk Music Genre', 'category', @folk_music_id,
--  (SELECT id FROM attributes WHERE name = 'categoryGenre'),
--  '{"type": "normalText", "data": "Traditional, Ceremonial"}'),

-- ('Folk Music Instruments', 'category', @folk_music_id,
--  (SELECT id FROM attributes WHERE name = 'categoryInstruments'),
--  '{"type": "normalArray", "data": {"label": "Traditional Instruments", "value": ["Drums", "Flutes", "String instruments"]}}');

-- -- 4. Add a new attribute for Folk Music
-- INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
-- (2, 'categoryAudioSamples', 'Audio recordings of folk music', false);

-- 5. Add content for new attribute
INSERT INTO content (name, associated_table, associated_table_id, attribute_id, value) VALUES
('Folk Music Samples', 'category', @folk_music_id,
 (SELECT id FROM attributes WHERE name = 'categoryAudioSamples'),
 '{
    "type": "mediaStorage",
    "data": [
      {
        "url": "https://storage/folk-music/sample1.mp3",
        "title": "Traditional harvest song",
        "duration": "5:30",
        "recordedBy": "Cultural Research Team",
        "recordedDate": "2024-01-20"
      },
      {
        "url": "https://storage/folk-music/sample2.mp3",
        "title": "Festival celebration music",
        "duration": "4:15",
        "recordedBy": "Cultural Research Team",
        "recordedDate": "2024-01-21"
      }
    ]
 }');



-- -- 6. Edit attribute name and description
-- UPDATE attributes 
-- SET name = 'categoryMusicSamples', 
--     description = 'Audio recordings and documentation of folk music pieces'
-- WHERE name = 'categoryAudioSamples';

-- -- 7. Update content value for the renamed attribute
-- UPDATE content 
-- SET value = JSON_SET(
--     value,
--     '$.data[0].description', 'Traditional harvest song with modern instruments',
--     '$.data[1].description', 'Festival music with traditional instruments'
-- )
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'categoryMusicSamples')
-- AND associated_table = 'category'
-- AND associated_table_id = @folk_music_id;

-- -- 8. Delete the audio samples attribute
-- DELETE FROM content 
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'categoryMusicSamples');

-- DELETE FROM attributes 
-- WHERE name = 'categoryMusicSamples';

-- -- 9. Query to verify all category attributes
-- SELECT 
--     c.name as category_name,
--     a.name as attribute_name,
--     cont.value
-- FROM categories c
-- JOIN content cont ON c.id = cont.associated_table_id
-- JOIN attributes a ON cont.attribute_id = a.id
-- WHERE cont.associated_table = 'category'
-- AND c.id = @folk_music_id;