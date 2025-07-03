-- Insert admin user
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, email_verified, created_at, updated_at) 
VALUES (1, 'admin@camerarentals.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Admin', 'User', 'ADMIN', true, NOW(), NOW());

-- Insert demo user
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, email_verified, created_at, updated_at) 
VALUES (2, 'john@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'John', 'Doe', 'USER', true, NOW(), NOW());

-- Insert cameras
INSERT IGNORE INTO cameras (id, name, brand, model, category, description, rent_per_day, availability, stock_quantity, created_at, updated_at) VALUES
(1, 'Canon EOS R5', 'Canon', 'EOS R5', 'MIRRORLESS', 'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording capabilities.', 75.00, true, 3, NOW(), NOW()),
(2, 'Sony A7R V', 'Sony', 'A7R V', 'MIRRORLESS', 'High-resolution mirrorless camera with 61MP sensor and advanced AI-powered autofocus.', 80.00, true, 2, NOW(), NOW()),
(3, 'Nikon D850', 'Nikon', 'D850', 'DSLR', 'Professional DSLR camera with 45.7MP sensor and exceptional dynamic range.', 65.00, true, 2, NOW(), NOW()),
(4, 'GoPro Hero 12', 'GoPro', 'Hero 12', 'GOPRO', 'Ultra-compact action camera with 5.3K video recording and advanced stabilization.', 25.00, true, 5, NOW(), NOW()),
(5, 'DJI Mavic 3', 'DJI', 'Mavic 3', 'DRONE', 'Professional drone with Hasselblad camera and 46-minute flight time.', 120.00, true, 2, NOW(), NOW()),
(6, 'Fujifilm X-T5', 'Fujifilm', 'X-T5', 'MIRRORLESS', 'Compact mirrorless camera with 40MP APS-C sensor and film simulation modes.', 55.00, true, 3, NOW(), NOW()),
(7, 'Canon RF 70-200mm f/2.8L', 'Canon', 'RF 70-200mm f/2.8L', 'LENS', 'Professional telephoto zoom lens with constant f/2.8 aperture.', 45.00, true, 3, NOW(), NOW()),
(8, 'Sony FX6', 'Sony', 'FX6', 'MIRRORLESS', 'Professional cinema camera with full-frame sensor and dual base ISO.', 200.00, true, 1, NOW(), NOW());

-- Insert camera features
INSERT IGNORE INTO camera_features (camera_id, feature) VALUES
(1, '45MP Full-Frame Sensor'), (1, '8K Video Recording'), (1, 'Dual Pixel CMOS AF'), (1, 'Image Stabilization'), (1, 'Weather Sealed'),
(2, '61MP Full-Frame Sensor'), (2, '4K Video Recording'), (2, 'AI-Powered Autofocus'), (2, 'In-Body Stabilization'), (2, 'Tilting LCD Screen'),
(3, '45.7MP Full-Frame Sensor'), (3, '4K UHD Video'), (3, '153-Point AF System'), (3, 'Dual Memory Card Slots'), (3, 'Weather Sealed'),
(4, '5.3K Video Recording'), (4, 'HyperSmooth 6.0'), (4, 'Waterproof to 10m'), (4, 'Voice Control'), (4, 'Live Streaming'),
(5, 'Hasselblad Camera'), (5, '5.1K Video Recording'), (5, '46-Minute Flight Time'), (5, 'Omnidirectional Obstacle Sensing'), (5, 'ActiveTrack 5.0'),
(6, '40MP APS-C Sensor'), (6, 'Film Simulation Modes'), (6, 'In-Body Stabilization'), (6, '6.2K Video Recording'), (6, 'Weather Resistant'),
(7, '70-200mm Zoom Range'), (7, 'Constant f/2.8 Aperture'), (7, 'Image Stabilization'), (7, 'Weather Sealed'), (7, 'Nano USM Motor'),
(8, 'Full-Frame Sensor'), (8, 'Dual Base ISO'), (8, '4K 120fps Recording'), (8, 'Electronic Variable ND Filter'), (8, 'Dual CFexpress Slots');

-- Insert camera images
INSERT IGNORE INTO camera_images (camera_id, image_url) VALUES
(1, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(1, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(2, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(2, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(3, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(3, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(4, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(4, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(5, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(5, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(6, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(6, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(7, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(7, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'),
(8, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'),
(8, 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800');