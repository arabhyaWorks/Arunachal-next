INSERT INTO attribute_types (name, description, validation_rules) VALUES
('Text', 'Simple text content', '{"max_length": 50000, "min_length": 1, "allow_html": false}'),
('Media', 'Media storage for images, videos, and audio', '{"allowed_types": ["image/jpeg", "image/png", "image/webp", "video/mp4", "audio/mp3", "audio/wav"], "max_size_mb": {"image": 10, "video": 500, "audio": 100}, "allowed_dimensions": {"image": {"max_width": 4096, "max_height": 4096}, "video": {"max_resolution": "4K"}}}'),
('Array', 'List of values with labels', '{"max_items": 100, "allow_duplicates": false}'),
('Date', 'Date values', '{"format": "YYYY-MM-DD", "min_date": "1800-01-01", "max_date": "2100-12-31"}'),
('Number', 'Numeric values', '{"allow_decimal": true, "precision": 2}'),
('Boolean', 'True/False values', '{}');