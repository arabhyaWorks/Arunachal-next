-- Create enum for basic attribute types
CREATE TYPE attribute_data_type AS ENUM (
    'normalText',
    'mediaStorage',
    'normalArray',
    'date',
    'number',
    'boolean'
);

-- Create AttributeTypes table
CREATE TABLE attribute_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Attributes table
CREATE TABLE attributes (
    id SERIAL PRIMARY KEY,
    attribute_type_id INTEGER REFERENCES attribute_types(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TribeAttributeConfig table (governs which attributes are active for all tribes)
CREATE TABLE tribe_attribute_config (
    id SERIAL PRIMARY KEY,
    attribute_id INTEGER REFERENCES attributes(id),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(attribute_id)
);

-- Create Tribes table
CREATE TABLE tribes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TribeAttributes table (stores actual values for tribe attributes)
CREATE TABLE tribe_attributes (
    id SERIAL PRIMARY KEY,
    tribe_id INTEGER REFERENCES tribes(id),
    attribute_id INTEGER REFERENCES attributes(id),
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tribe_id, attribute_id)
);

-- Create CategoryAttributes table (stores actual values for category attributes)
CREATE TABLE category_attributes (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    attribute_id INTEGER REFERENCES attributes(id),
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, attribute_id)
);

-- Create indexes for better performance
CREATE INDEX idx_tribe_attributes_tribe_id ON tribe_attributes(tribe_id);
CREATE INDEX idx_tribe_attributes_attribute_id ON tribe_attributes(attribute_id);
CREATE INDEX idx_category_attributes_category_id ON category_attributes(category_id);
CREATE INDEX idx_category_attributes_attribute_id ON category_attributes(attribute_id);