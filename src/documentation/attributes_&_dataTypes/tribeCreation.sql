-- First, let's add more tribes
INSERT INTO tribes (name) VALUES 
('Khamti'),
('Singpho'),
('Sherdukpen'),
('Aka'),
('Miji'),
('Bangni'),
('Puroik'),
('Bugun'),
('Khamba'),
('Memba');

-- Get the attributes IDs (reconfirming)
SET @name_attr_id = (SELECT id FROM attributes WHERE name = 'Name');
SET @about_attr_id = (SELECT id FROM attributes WHERE name = 'About');
SET @history_attr_id = (SELECT id FROM attributes WHERE name = 'History');
SET @distribution_attr_id = (SELECT id FROM attributes WHERE name = 'Distribution');

-- Add attribute values for Khamti tribe
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
((SELECT id FROM tribes WHERE name = 'Khamti'), @name_attr_id, 
 '{"type": "normalText", "data": "Khamti"}'),
((SELECT id FROM tribes WHERE name = 'Khamti'), @about_attr_id, 
 '{"type": "normalText", "data": "The Khamti are a Buddhist tribe known for their advanced irrigation systems and wet rice cultivation. They have a highly developed script and literature."}'),
((SELECT id FROM tribes WHERE name = 'Khamti'), @history_attr_id, 
 '{"type": "normalText", "data": "The Khamti migrated from the Shan state of Myanmar in the 18th century. They have maintained their distinct cultural identity and Buddhist traditions."}'),
((SELECT id FROM tribes WHERE name = 'Khamti'), @distribution_attr_id, 
 '{"type": "normalText", "data": "Primarily settled in Namsai district and parts of Lohit district."}');

-- Add attribute values for Singpho tribe
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
((SELECT id FROM tribes WHERE name = 'Singpho'), @name_attr_id, 
 '{"type": "normalText", "data": "Singpho"}'),
((SELECT id FROM tribes WHERE name = 'Singpho'), @about_attr_id, 
 '{"type": "normalText", "data": "The Singpho are known for their expertise in tea cultivation. They were among the first to cultivate tea in India."}'),
((SELECT id FROM tribes WHERE name = 'Singpho'), @history_attr_id, 
 '{"type": "normalText", "data": "The Singpho people have historical connections with Myanmar and were instrumental in introducing tea cultivation to the British, leading to the establishment of the tea industry in Assam."}'),
((SELECT id FROM tribes WHERE name = 'Singpho'), @distribution_attr_id, 
 '{"type": "normalText", "data": "Found in Changlang district and parts of Tirap district."}');

-- Add attribute values for Sherdukpen tribe
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
((SELECT id FROM tribes WHERE name = 'Sherdukpen'), @name_attr_id, 
 '{"type": "normalText", "data": "Sherdukpen"}'),
((SELECT id FROM tribes WHERE name = 'Sherdukpen'), @about_attr_id, 
 '{"type": "normalText", "data": "The Sherdukpen are known for their unique social structure and rich cultural traditions. They practice Buddhism with elements of indigenous beliefs."}'),
((SELECT id FROM tribes WHERE name = 'Sherdukpen'), @history_attr_id, 
 '{"type": "normalText", "data": "The Sherdukpen have historical trade links with Tibet and Bhutan. Their culture shows strong influences from both Buddhist and pre-Buddhist traditions."}'),
((SELECT id FROM tribes WHERE name = 'Sherdukpen'), @distribution_attr_id, 
 '{"type": "normalText", "data": "Mainly inhabit the West Kameng district, particularly in Rupa and Shergaon valleys."}');

-- Add attribute values for Aka (Hrusso) tribe
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
((SELECT id FROM tribes WHERE name = 'Aka'), @name_attr_id, 
 '{"type": "normalText", "data": "Aka (Hrusso)"}'),
((SELECT id FROM tribes WHERE name = 'Aka'), @about_attr_id, 
 '{"type": "normalText", "data": "The Aka, also known as Hrusso, are known for their distinctive traditional weaving and their unique social customs."}'),
((SELECT id FROM tribes WHERE name = 'Aka'), @history_attr_id, 
 '{"type": "normalText", "data": "The Aka have a rich history of trading with plains people and maintaining their distinct cultural identity despite external influences."}'),
((SELECT id FROM tribes WHERE name = 'Aka'), @distribution_attr_id, 
 '{"type": "normalText", "data": "Primarily inhabit the East and West Kameng districts."}');

-- Verify the newly added tribes
SELECT 
    t.name as tribe_name,
    a.name as attribute_name,
    ta.value
FROM tribes t
JOIN tribe_attributes ta ON t.id = ta.tribe_id
JOIN attributes a ON ta.attribute_id = a.id
WHERE t.name IN ('Khamti', 'Singpho', 'Sherdukpen', 'Aka')
ORDER BY t.name, a.name;