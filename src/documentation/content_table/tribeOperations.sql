-- 1. Create a tribe
INSERT INTO tribes (name) VALUES ('Adi');
SET @adi_id = LAST_INSERT_ID();

-- 2. Add required attributes
INSERT INTO content (name, associated_table, associated_table_id, attribute_id, value) VALUES
('Adi Name', 'tribe', @adi_id, 
(SELECT id FROM attributes WHERE name = 'tribeName'),
'{"type": "normalText", "data": "Adi"}'),

('Adi About', 'tribe', @adi_id,
(SELECT id FROM attributes WHERE name = 'tribeAbout'),
'{"type": "normalText", "data": "The Adi tribe is known for their rich cultural heritage"}'),

('Adi History', 'tribe', @adi_id,
(SELECT id FROM attributes WHERE name = 'tribeHistory'),
'{"type": "normalText", "data": "Ancient tribe with strong community traditions"}'),

('Adi Distribution', 'tribe', @adi_id,
(SELECT id FROM attributes WHERE name = 'tribeDistribution'),
'{"type": "normalText", "data": "East Siang, Upper Siang districts"}');

-- -- 3. Create new attribute for tribe
-- INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
-- (1, 'tribePopulation', 'Population statistics of tribe', false);

-- -- Add to tribe_attribute_config
-- INSERT INTO tribe_attribute_config (attribute_id, display_order)
-- SELECT id, (SELECT MAX(display_order) + 1 FROM tribe_attribute_config)
-- FROM attributes WHERE name = 'tribePopulation';

-- -- 4. Populate new attribute
-- INSERT INTO content (name, associated_table, associated_table_id, attribute_id, value) VALUES
-- ('Adi Population', 'tribe', @adi_id,
-- (SELECT id FROM attributes WHERE name = 'tribePopulation'),
-- '{"type": "normalText", "data": "150,000 approximately"}');

-- -- 5. Edit attribute name
-- UPDATE attributes 
-- SET name = 'tribeDemography', description = 'Demographic details of tribe'
-- WHERE name = 'tribePopulation';

-- -- 6. Edit tribe's attribute value
-- UPDATE content 
-- SET value = '{"type": "normalText", "data": "Population: 150,000, Growth Rate: 2.5% annually"}'
-- WHERE associated_table = 'tribe' 
-- AND associated_table_id = @adi_id 
-- AND attribute_id = (SELECT id FROM attributes WHERE name = 'tribeDemography');

-- -- 7. Delete attribute
-- DELETE FROM content 
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'tribeDemography');

-- DELETE FROM tribe_attribute_config 
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'tribeDemography');

-- DELETE FROM attributes 
-- WHERE name = 'tribeDemography';


-- 1. Create new 'images' attribute for tribe
-- INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
-- (2, 'tribeImages', 'Images documenting tribal life and culture', false);

-- -- 2. Add to tribe_attribute_config with display order
-- INSERT INTO tribe_attribute_config (attribute_id, display_order)
-- SELECT id, (SELECT MAX(display_order) + 1 FROM tribe_attribute_config)
-- FROM attributes WHERE name = 'tribeImages';

-- 3. Add image data for Adi tribe
-- INSERT INTO content (name, associated_table, associated_table_id, attribute_id, value) VALUES
-- ('Adi Images', 'tribe', @adi_id,
-- (SELECT id FROM attributes WHERE name = 'tribeImages'),
-- '{
--    "type": "mediaStorage",
--    "data": [
--      {
--        "url": "https://storage/tribal-images/adi_festival.jpg",
--        "description": "Solung Festival celebration",
--        "type": "image/jpeg",
--        "capturedDate": "2024-01-15",
--        "location": "East Siang"
--      },
--      {
--        "url": "https://storage/tribal-images/adi_dance.jpg",
--        "description": "Traditional Ponung dance",
--        "type": "image/jpeg",
--        "capturedDate": "2024-01-16",
--        "location": "Upper Siang"
--      }
--    ]
-- }');

-- -- 4. Rename attribute to be more specific
-- UPDATE attributes 
-- SET name = 'tribeCulturalImages', 
--    description = 'Visual documentation of cultural practices and events'
-- WHERE name = 'tribeImages';

-- -- 5. Delete attribute and related data
-- -- First delete from content
-- DELETE FROM content 
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'tribeCulturalImages');

-- -- Then delete from tribe_attribute_config
-- DELETE FROM tribe_attribute_config 
-- WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'tribeCulturalImages');

-- -- Finally delete the attribute itself
-- DELETE FROM attributes 
-- WHERE name = 'tribeCulturalImages';