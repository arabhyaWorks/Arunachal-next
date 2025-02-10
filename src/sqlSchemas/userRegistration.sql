-- -- 1. Create the Admin role (if not already created)
-- INSERT INTO roles (name, description, permissions)
-- VALUES ('Admin', 'Administrator with full system rights', '{"all": true}');

-- -- 2. Create a test user with admin rights.
-- -- Replace the password hash below with a valid hash for your application.
-- INSERT INTO users (
--   registration_number, 
--   username, 
--   email, 
--   password_hash, 
--   first_name, 
--   last_name, 
--   role_id, 
--   status, 
--   phone
-- )
-- VALUES (
--   'REG20250209001', 
--   'testuser', 
--   'testuser@example.com', 
--   '$2a$12$abcdefghijklmnopqrstuv',  -- example hash; use your own secure hash
--   'Test', 
--   'User', 
--   (SELECT id FROM roles WHERE name = 'Admin'), 
--   'active', 
--   '1234567890'
-- );



INSERT INTO roles (name, description, permissions)
VALUES
('Director',
 'Full system access',
 '{
   "actions":{
     "view_all":true,
     "add_all":true,
     "edit_all":true,
     "delete_all":true
   }
 }'),
('Deputy Director',
 'View only all contents',
 '{
   "actions":{
     "view_all":true
   }
 }'),
('Assistant Director',
 'View only all contents',
 '{
   "actions":{
     "view_all":true
   }
 }'),
('CBO',
 'View only all contents',
 '{
   "actions":{
     "view_all":true
   }
 }'),
('CMS Manager',
 'Add, view, edit, delete all contents',
 '{
   "actions":{
     "view_all":true,
     "add_all":true,
     "edit_all":true,
     "delete_all":true
   }
 }'),
('Content Creator',
 'Add, edit, delete own; view all',
 '{
   "actions":{
     "view_all":true,
     "add_own":true,
     "edit_own":true,
     "delete_own":true
   }
 }'),
('Artist',
 'Add, edit, delete own; view all',
 '{
   "actions":{
     "view_all":true,
     "add_own":true,
     "edit_own":true,
     "delete_own":true
   }
 }'),
('Guest',
 'View only all contents',
 '{
   "actions":{
     "view_all":true
   }
 }');


 INSERT INTO users (
    registration_number,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    role_id,
    status
)
VALUES
('REG0001','director','director@example.com','hashedpwd','Director','User',1,'active'),
('REG0002','deputy','deputy@example.com','hashedpwd','Deputy','User',2,'active'),
('REG0003','assistant','assistant@example.com','hashedpwd','Assistant','User',3,'active'),
('REG0004','cbo','cbo@example.com','hashedpwd','Cbo','Member',4,'active'),
('REG0005','cms','cms@example.com','hashedpwd','Cms','Manager',5,'active'),
('REG0006','creator','creator@example.com','hashedpwd','Creator','User',6,'active'),
('REG0007','artist','artist@example.com','hashedpwd','Artist','User',7,'active'),
('REG0008','guest','guest@example.com','hashedpwd','Guest','User',8,'active');