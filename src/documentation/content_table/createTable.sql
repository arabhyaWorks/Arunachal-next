-- Attribute Types Table
CREATE TABLE attribute_types (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   description TEXT,
   validation_rules JSON,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
   FOREIGN KEY (attribute_type_id) REFERENCES attribute_types(id)
);

-- Tribes Table
CREATE TABLE tribes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(200) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(200) NOT NULL,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contents Table
CREATE TABLE content (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   associated_table ENUM('tribe', 'category') NOT NULL,
   associated_table_id INT NOT NULL,
   attribute_id INT,
   value JSON NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   UNIQUE(associated_table, associated_table_id, attribute_id),
   FOREIGN KEY (attribute_id) REFERENCES attributes(id),
   INDEX idx_content_search (associated_table, associated_table_id, name),
   INDEX idx_json_search ((CAST(value->>'$.data' AS CHAR(255))))
);

-- Tribe Attribute Config Table
CREATE TABLE tribe_attribute_config (
   id INT AUTO_INCREMENT PRIMARY KEY,
   attribute_id INT,
   is_active BOOLEAN DEFAULT true,
   display_order INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   UNIQUE(attribute_id),
   FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);