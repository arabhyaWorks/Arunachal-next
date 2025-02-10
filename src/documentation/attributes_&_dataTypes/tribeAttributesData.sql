-- Let's get the Khamti tribe ID
SET @khamti_id = (SELECT id FROM tribes WHERE name = 'Khamti');

-- Add/Update Attributes for Khamti
-- First, let's create some rich cultural information in different aspects

-- Region/Cultural Origin
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
(@khamti_id, 
 (SELECT id FROM attributes WHERE name = 'Region'), 
 '{"type": "normalText", "data": "The Khamti people primarily inhabit the Namsai district of Arunachal Pradesh, with significant populations also found in the plains of Lohit district. They are also present in parts of Assam and Myanmar. The region is characterized by its fertile plains and is ideal for their traditional wet rice cultivation."}');

-- Social Significance
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
(@khamti_id, 
 (SELECT id FROM attributes WHERE name = 'SocialSignificance'), 
 '{"type": "normalText", "data": "The Khamti are known for their highly organized social structure. They are one of the most advanced tribes in Arunachal Pradesh, with their own script and literature. They practice Theravada Buddhism while maintaining their tribal customs. Their society is known for its democratic values and equal treatment of women. The Khamtis are skilled craftsmen, particularly in woodcarving, pottery, and weaving."}');

-- Historical Context
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
(@khamti_id, 
 (SELECT id FROM attributes WHERE name = 'HistoricalContext'), 
 '{"type": "normalText", "data": "The Khamtis are historically connected to the Tai race and migrated from the Shan state of Myanmar in the 18th century. They were among the first tribes to embrace Buddhism and establish a systematic form of administration. They played a significant role in the regions history, including the famous resistance against British colonial expansion in 1839. Their religious practices, centered around Buddhist monasteries (Viharas), have been instrumental in preserving their cultural identity and educational traditions."}');

-- Add some associated instruments (though this is technically a music attribute, we can use it to store traditional instruments)
INSERT INTO tribe_attributes (tribe_id, attribute_id, value) VALUES
(@khamti_id, 
 (SELECT id FROM attributes WHERE name = 'Instruments'), 
 '{"type": "normalArray", "data": {
    "label": "Traditional Instruments", 
    "value": [
      "Khap (Traditional drum)",
      "Mukkok (Traditional gong)",
      "Pee (Traditional flute)",
      "Kong (Bronze gongs)",
      "Tingkhong (Cymbals)"
    ]
  }}');

-- Verify the updated information
SELECT 
    t.name as tribe_name,
    a.name as attribute_name,
    ta.value
FROM tribes t
JOIN tribe_attributes ta ON t.id = ta.tribe_id
JOIN attributes a ON ta.attribute_id = a.id
WHERE t.name = 'Khamti'
ORDER BY a.id;