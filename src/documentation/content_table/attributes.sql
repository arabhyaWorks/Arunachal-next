-- Reset tables
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE tribe_attribute_config;
TRUNCATE TABLE content;
TRUNCATE TABLE attributes;
SET FOREIGN_KEY_CHECKS=1;

-- Insert tribe attributes
INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
(1, 'tribeName', 'Name of the tribe', true),
(1, 'tribeAbout', 'Description about the tribe', true),
(1, 'tribeHistory', 'Historical information of tribe', true),
(1, 'tribeDistribution', 'Geographical distribution of tribe', true);

-- Configure display order
INSERT INTO tribe_attribute_config (attribute_id, display_order) 
SELECT id, ROW_NUMBER() OVER (ORDER BY id)
FROM attributes 
WHERE name LIKE 'tribe%';