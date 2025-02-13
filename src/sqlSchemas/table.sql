-- ======================================================
-- 1. Database and Core User/Role Tables
-- ======================================================

-- Drop Database 
DROP DATABASE IF EXISTS indigenous_arunachal;

-- Create Database
CREATE DATABASE IF NOT EXISTS indigenous_arunachal 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE indigenous_arunachal;

-- Roles Table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (name)
) ENGINE=InnoDB;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('unverified', 'verified', 'active', 'inactive', 'suspended', 'blocked') DEFAULT 'unverified',
    phone VARCHAR(20),
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_role (role_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Security Questions Table
CREATE TABLE security_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_question (question(100))
) ENGINE=InnoDB;

INSERT INTO security_questions (question) VALUES 
("What is the name of your first pet?"),
("In which city were you born?"),
("What is your mother's maiden name?");

-- User Security Answers Table
CREATE TABLE user_security_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES security_questions(id),
    UNIQUE KEY unique_user_question (user_id, question_id)
) ENGINE=InnoDB;

-- ======================================================
-- 2. Attribute Management Tables
-- ======================================================

-- Attribute Types Table
CREATE TABLE attribute_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    validation_rules JSON,
    value_structure JSON,
    meta_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Attributes Table
CREATE TABLE attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_type_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (attribute_type_id) REFERENCES attribute_types(id),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- ======================================================
-- 3. Domain Tables for Tribes and Categories
-- ======================================================

-- Tribes Table
CREATE TABLE tribes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB;

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB;

CREATE TABLE category_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,     -- e.g., “Harvest Song”, “Night Lullaby”
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB;

-- Committee Table
CREATE TABLE committees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tribe_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  purpose TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (tribe_id) REFERENCES tribes(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Committee Members Table
CREATE TABLE committee_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  committee_id INT NOT NULL,
  user_id INT NOT NULL,
  hierarchy_level INT NOT NULL,
  is_permanent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (committee_id) REFERENCES committees(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Content Table (Stores attribute values for tribes & categories)
CREATE TABLE content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    associated_table ENUM('tribe', 'category', "category_item") NOT NULL,
    associated_table_id INT NOT NULL,
    attribute_id INT,
    status ENUM('pending','active','archived') DEFAULT 'pending',
    value JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    UNIQUE (associated_table, associated_table_id, attribute_id),
    FOREIGN KEY (attribute_id) REFERENCES attributes(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_content_search (associated_table, associated_table_id, name),
    FULLTEXT INDEX idx_name_search (name)
) ENGINE=InnoDB;

-- Content Approval Table 
CREATE TABLE content_approval (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT NOT NULL,
  committee_id INT NOT NULL,
  status ENUM('pending','approved','rejected','reupload') DEFAULT 'pending',
  current_level INT NOT NULL,
  remarks TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id),
  FOREIGN KEY (committee_id) REFERENCES committees(id)
) ENGINE=InnoDB;

-- Notifications Table

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Tribe Attribute Config Table (Global attributes for all tribes)
CREATE TABLE tribe_attribute_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT,
    is_active BOOLEAN DEFAULT true,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    UNIQUE (attribute_id),
    FOREIGN KEY (attribute_id) REFERENCES attributes(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_active_order (is_active, display_order)
) ENGINE=InnoDB;

-- Category Attribute Config Table (Attributes specific to a category)
CREATE TABLE category_attribute_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    attribute_id INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (attribute_id) REFERENCES attributes(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE (category_id, attribute_id),
    INDEX idx_category (category_id),
    INDEX idx_attribute (attribute_id)
) ENGINE=InnoDB;

-- ======================================================
-- 4. Audit & Logging Tables
-- ======================================================

-- User Audit Logs Table
CREATE TABLE user_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_details JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_action (user_id, action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ======================================================
-- 5. Media Management Tables
-- ======================================================

CREATE TABLE image (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  associated_tribe_id INT,
  associated_category_id INT,
  associated_category_item_id INT,
  file_path VARCHAR(500) NOT NULL,
  media_type ENUM('image') NOT NULL DEFAULT 'image',
  mime_type VARCHAR(100) NOT NULL,
  status ENUM('pending','active','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE audio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  associated_tribe_id INT,
  associated_category_id INT,
  associated_category_item_id INT,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  lyrics TEXT,
  genre JSON,
  composer VARCHAR(255),
  performers JSON,
  instruments JSON,
  media_type ENUM('audio') NOT NULL DEFAULT 'audio',
  mime_type VARCHAR(100) NOT NULL,
  status ENUM('pending','active','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE video (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  associated_tribe_id INT,
  associated_category_id INT,
  associated_category_item_id INT,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  media_type ENUM('video') NOT NULL DEFAULT 'video',
  mime_type VARCHAR(100) NOT NULL,
  status ENUM('pending','active','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE document (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  associated_tribe_id INT,
  associated_category_id INT,
  associated_category_item_id INT,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  media_type ENUM('document') NOT NULL DEFAULT 'document',
  mime_type VARCHAR(100) NOT NULL,
  status ENUM('pending','active','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;


CREATE TABLE search_index (
   id INT AUTO_INCREMENT PRIMARY KEY,
   source_type VARCHAR(50),
   source_id INT,
   searchable_text TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FULLTEXT (searchable_text)
) ENGINE=InnoDB;


-- =================================================
-- 6. Insertion of Default Attribute Types
-- =================================================


-- Insertion of Default Attribute Types
INSERT INTO attribute_types (name, description, validation_rules, value_structure, meta_data)
VALUES
-- 1) Text
(
  'Text',
  'Simple text content',
  '{"max_length": 50000, "min_length": 1, "allow_html": false}',
  '{
    "type": "normalText",
    "example": {
      "value": "String"
    }
  }',
  '{}'
),
-- 2) Array
(
  'Array',
  'List of values with labels',
  '{"max_items": 100, "allow_duplicates": false}',
  '{
    "type": "normalArray",
    "example": {
      "value": ["String1", "String2"]
    }
  }',
  '{}'
),
-- 3) Date
(
  'Date',
  'Date values',
  '{"format": "YYYY-MM-DD", "min_date": "1800-01-01", "max_date": "2100-12-31"}',
  '{
    "type": "dateValue",
    "example": {
      "value": "YYYY-MM-DD"
    }
  }',
  '{}'
),
-- 4) Number
(
  'Number',
  'Numeric values',
  '{"allow_decimal": true, "precision": 2}',
  '{
    "type": "numberValue",
    "example": {
      "value": 3.14
    }
  }',
  '{}'
),
-- 5) Boolean
(
  'Boolean',
  'True/False values',
  '{}',
  '{
    "type": "booleanValue",
    "example": {
      "value": true
    }
  }',
  '{}'
),
-- 6) Relations
(
  'Relations',
  'Stores references to other tables',
  '{"max_items": 50, "allow_duplicates": false}',
  '{
    "type": "relationsToOtherTables",
    "example": {
      "value": [
        {
          "associated_table": "tribes",
          "associated_table_id": 1,
          "name": "Adi"
        }
      ]
    }
  }',
  '{}'
),
-- 7) Image
(
  'Image',
  'Simple image storage',
  '{"allowed_types":["image/jpeg","image/png","image/webp"],"max_size_mb":{"image":10}}',
  '{
    "type": "mediaStorage",
    "example": {
      "value":{
          "url": "https://example.com/img1.jpg",
          "type": "image/jpeg",
          "timestamp": "2025-02-09"
        }
    }
  }',
  '{"type":"image","schema":{"title":"string","description":"string","associated_tribe_id": "string", "associated_category_id": "string", "associated_category_item_id": "string","file_path":"string","thumbnail_path":"string","media_type":"image","mime_type":"string","status":"string","created_at":"timestamp","updated_at":"timestamp","created_by":"int","updated_by":"int"}}'
),
-- 8) Audio
(
  'Audio',
  'Audio storage with extended fields',
  '{"allowed_types":["audio/mp3","audio/wav"],"max_size_mb":{"audio":100}}',
  '{
    "type": "audio",
    "example": {
      "value": [11,2121,2121]
    }
  }',
  '{"type":"audio","schema":{"title":"string","description":"string","associated_tribe_id": "string", "associated_category_id": "string", "associated_category_item_id": "string", "file_path":"string","thumbnail_path":"string","lyrics":"string","genre":"array","composer":"string","performers":"array","instruments":"array","media_type":"audio","mime_type":"string","status":"string","created_at":"timestamp","updated_at":"timestamp","created_by":"int","updated_by":"int"}}'
),
-- 9) Video
(
  'Video',
  'Video storage with extended fields',
  '{"allowed_types":["video/mp4"],"max_size_mb":{"video":500}}',
  '{
    "type": "video",
    "example": {
      "value": [99,100]
    }
  }',
  '{"type":"video","schema":{"title":"string","description":"string","associated_tribe_id": "string", "associated_category_id": "string", "associated_category_item_id": "string", "file_path":"string","thumbnail_path":"string","media_type":"video","mime_type":"string","status":"string","created_at":"timestamp","updated_at":"timestamp","created_by":"int","updated_by":"int"}}'
),
-- 10) Document
(
  'Document',
  'PDF or doc file storage',
  '{"allowed_types":["application/pdf"],"max_size_mb":{"document":100}}',
  '{
    "type": "document",
    "example": {
      "value": [123,456]
    }
  }',
  '{"type":"document","schema":{"title":"string","description":"string","associated_tribe_id": "string", "associated_category_id": "string", "associated_category_item_id": "string", "file_path":"string","thumbnail_path":"string","media_type":"document","mime_type":"string","status":"string","created_at":"timestamp","updated_at":"timestamp","created_by":"int","updated_by":"int"}}'
),
-- 11) Advanced Image
(
  'Advance Image',
  'Advance image storage',
  '{"allowed_types":["image/jpeg","image/png","image/webp"],"max_size_mb":{"image":10}}',
  '{
    "type": "mediaStorage",
    "example": {
      "value": [123,456]
    }
  }',
  '{"type":"image","schema":{"title":"string","description":"string","associated_tribe_id": "string", "associated_category_id": "string", "associated_category_item_id": "string", "file_path":"string","media_type":"image","mime_type":"string","status":"string","created_at":"timestamp","updated_at":"timestamp","created_by":"int","updated_by":"int"}}'
);

-- ======================================================
-- 6. Insertion of Default Tribe Attributes
-- ======================================================

-- Insert default tribe attributes with proper naming convention (prefix "tribe-")
INSERT INTO attributes (attribute_type_id, name, description, is_required) VALUES
    (1, 'tribe-About', 'Description about the tribe', true),
    (1, 'tribe-History', 'Historical information of tribe', true),
    (1, 'tribe-Distribution', 'Geographical distribution of tribe', true),
    (9, 'tribe-Tribe-VideosOfTheTribe', 'Videos of the tribe', true),
    (1, 'tribe-Tribe-Regions', 'Regions of the tribe', true),
    (1, 'tribe-Tribe-Population', 'Population of the tribe', true),
    (1, 'tribe-Tribe-Language', 'Language of the tribe', true),
    (2, 'tribe-Tribe-TraditionalDresses', 'Traditional dresses of the tribe', true),
    (2, 'tribe-Tribe-Arts&Crafts', 'Arts & Crafts of the tribe', true),
    (2, 'tribe-Tribe-TraditionalCuisine', 'Traditional Cuisine of the tribe', true);



-- Configure display order for these tribe attributes using window function (MySQL 8.0+)
INSERT INTO tribe_attribute_config (attribute_id, display_order)
SELECT id, ROW_NUMBER() OVER (ORDER BY id)
FROM attributes
WHERE name LIKE 'tribe%';



-- =================================================
-- 7. Roles and Users Initialization
-- =================================================


INSERT INTO roles (name, description, permissions)
VALUES
('Director',
 'Full system access',
 '{
   "actions":{
     "view":true,
     "add":true,
     "edit":true,
     "delete":true,
     "all":true
   }
 }'),
('Deputy Director',
 'View only all contents',
 '{
   "actions":{
     "view":true,
     "add":false,
     "edit":false,
     "delete":false,
     "all":true
   }
 }'),
('Assistant Director',
 'View only all contents',
 '{
   "actions":{
     "view":true
   }
 }'),
('CBO',
 'View only all contents',
 '{
   "actions":{
     "view":true
   }
 }'),
('CMS Manager',
 'Add, view, edit, delete all contents',
 '{
   "actions":{
     "view":true,
     "add_all":true,
     "edit_all":true,
     "delete_all":true
   }
 }'),
('Content Creator',
 'Add, edit, delete own; view all',
 '{
   "actions":{
     "view":true,
     "add_own":true,
     "edit_own":true,
     "delete_own":true
   }
 }'),
('Artist',
 'Add, edit, delete own; view all',
 '{
   "actions":{
     "view":true,
     "add_own":true,
     "edit_own":true,
     "delete_own":true
   }
 }'),
('Guest',
 'View only all contents',
 '{
   "actions":{
     "view":true
   }
 }');


 INSERT INTO users (
    registration_number,
    email,
    password_hash,
    first_name,
    last_name,
    role_id,
    status
)
VALUES
('REG0001','director@example.com','hashedpwd','Director','User',1,'active'),
('REG0002','deputy@example.com','hashedpwd','Deputy','User',2,'active'),
('REG0003','assistant@example.com','hashedpwd','Assistant','User',3,'active'),
('REG0004','cbo@example.com','hashedpwd','Cbo','Member',4,'active'),
('REG0005','cms@example.com','hashedpwd','Cms','Manager',5,'active'),
('REG0006','creator@example.com','hashedpwd','Creator','User',6,'active'),
('REG0007','artist@example.com','hashedpwd','Artist','User',7,'active'),
('REG0008','guest@example.com','hashedpwd','Guest','User',8,'active');