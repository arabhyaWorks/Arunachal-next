-- -- First disable foreign key checks
-- SET FOREIGN_KEY_CHECKS=0;

-- -- Truncate all tables
-- TRUNCATE TABLE content;
-- TRUNCATE TABLE tribe_attribute_config;
-- TRUNCATE TABLE attributes;
-- TRUNCATE TABLE attribute_types;
-- TRUNCATE TABLE tribes;
-- TRUNCATE TABLE categories;

-- -- Re-enable foreign key checks
-- SET FOREIGN_KEY_CHECKS=1;

select * from attribute_types;
select * from attributes;
select * from content;
select * from categories;
select * from tribes;
select * from tribe_attribute_config;
