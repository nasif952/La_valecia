-- Insert categories
INSERT INTO categories (id, name, slug) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Drop Shoulder', 'drop-shoulder'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Wintery', 'wintery'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, slug, description, price_cents, primary_color, fit, material, care, is_active) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'Drop Shoulder Hoodie', 'drop-shoulder-hoodie', 'Premium drop shoulder hoodie with modern fit and comfortable material. Perfect for casual wear and street style.', 8900, 'Black', 'Oversized', 'Cotton Blend', 'Machine wash cold, tumble dry low', true),
    ('650e8400-e29b-41d4-a716-446655440002', 'Drop Shoulder T-Shirt', 'drop-shoulder-tshirt', 'Classic drop shoulder t-shirt with premium cotton blend. Available in multiple colors and sizes.', 3900, 'White', 'Oversized', '100% Cotton', 'Machine wash cold, tumble dry low', true),
    ('650e8400-e29b-41d4-a716-446655440003', 'Wintery Jacket', 'wintery-jacket', 'Warm and stylish winter jacket with premium insulation. Perfect for cold weather and outdoor activities.', 12900, 'Navy', 'Regular', 'Polyester Blend', 'Dry clean only', true),
    ('650e8400-e29b-41d4-a716-446655440004', 'Wintery Hoodie', 'wintery-hoodie', 'Cozy winter hoodie with fleece lining. Great for layering or wearing alone on mild winter days.', 6900, 'Gray', 'Regular', 'Fleece', 'Machine wash cold, tumble dry low', true),
    ('650e8400-e29b-41d4-a716-446655440005', 'Futuristic Cap', 'futuristic-cap', 'Modern cap with futuristic design elements. Perfect accessory for completing your street style look.', 2900, 'Black', 'One Size', 'Polyester', 'Hand wash, air dry', true),
    ('650e8400-e29b-41d4-a716-446655440006', 'Premium Beanie', 'premium-beanie', 'Soft and warm beanie made from premium materials. Available in multiple colors.', 1900, 'Black', 'One Size', 'Acrylic', 'Machine wash cold, air dry', true),
    ('650e8400-e29b-41d4-a716-446655440007', 'Drop Shoulder Sweatshirt', 'drop-shoulder-sweatshirt', 'Comfortable drop shoulder sweatshirt perfect for lounging or casual outings.', 5900, 'Green', 'Oversized', 'Cotton Blend', 'Machine wash cold, tumble dry low', true),
    ('650e8400-e29b-41d4-a716-446655440008', 'Wintery Gloves', 'wintery-gloves', 'Warm and flexible winter gloves with touch screen compatibility.', 3900, 'Black', 'One Size', 'Synthetic', 'Hand wash, air dry', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert product images (placeholder paths)
INSERT INTO product_images (product_id, image_path, sort) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'drop-shoulder-hoodie-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440001', 'drop-shoulder-hoodie-2.jpg', 2),
    ('650e8400-e29b-41d4-a716-446655440002', 'drop-shoulder-tshirt-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440002', 'drop-shoulder-tshirt-2.jpg', 2),
    ('650e8400-e29b-41d4-a716-446655440003', 'wintery-jacket-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440003', 'wintery-jacket-2.jpg', 2),
    ('650e8400-e29b-41d4-a716-446655440004', 'wintery-hoodie-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440005', 'futuristic-cap-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440006', 'premium-beanie-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440007', 'drop-shoulder-sweatshirt-1.jpg', 1),
    ('650e8400-e29b-41d4-a716-446655440008', 'wintery-gloves-1.jpg', 1)
ON CONFLICT DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, sku, size, color, stock) VALUES
    -- Drop Shoulder Hoodie variants
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-BLK-S', 'S', 'Black', 10),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-BLK-M', 'M', 'Black', 15),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-BLK-L', 'L', 'Black', 12),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-BLK-XL', 'XL', 'Black', 8),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-GRY-S', 'S', 'Gray', 10),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-GRY-M', 'M', 'Gray', 15),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-GRY-L', 'L', 'Gray', 12),
    ('650e8400-e29b-41d4-a716-446655440001', 'DSH-GRY-XL', 'XL', 'Gray', 8),
    
    -- Drop Shoulder T-Shirt variants
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-WHT-S', 'S', 'White', 20),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-WHT-M', 'M', 'White', 25),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-WHT-L', 'L', 'White', 20),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-WHT-XL', 'XL', 'White', 15),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-BLK-S', 'S', 'Black', 20),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-BLK-M', 'M', 'Black', 25),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-BLK-L', 'L', 'Black', 20),
    ('650e8400-e29b-41d4-a716-446655440002', 'DST-BLK-XL', 'XL', 'Black', 15),
    
    -- Wintery Jacket variants
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-NVY-S', 'S', 'Navy', 8),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-NVY-M', 'M', 'Navy', 12),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-NVY-L', 'L', 'Navy', 10),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-NVY-XL', 'XL', 'Navy', 6),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-BLK-S', 'S', 'Black', 8),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-BLK-M', 'M', 'Black', 12),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-BLK-L', 'L', 'Black', 10),
    ('650e8400-e29b-41d4-a716-446655440003', 'WJ-BLK-XL', 'XL', 'Black', 6),
    
    -- Wintery Hoodie variants
    ('650e8400-e29b-41d4-a716-446655440004', 'WH-GRY-S', 'S', 'Gray', 10),
    ('650e8400-e29b-41d4-a716-446655440004', 'WH-GRY-M', 'M', 'Gray', 15),
    ('650e8400-e29b-41d4-a716-446655440004', 'WH-GRY-L', 'L', 'Gray', 12),
    ('650e8400-e29b-41d4-a716-446655440004', 'WH-GRY-XL', 'XL', 'Gray', 8),
    
    -- Futuristic Cap (one size)
    ('650e8400-e29b-41d4-a716-446655440005', 'FC-BLK-OS', 'One Size', 'Black', 25),
    ('650e8400-e29b-41d4-a716-446655440005', 'FC-WHT-OS', 'One Size', 'White', 25),
    
    -- Premium Beanie (one size)
    ('650e8400-e29b-41d4-a716-446655440006', 'PB-BLK-OS', 'One Size', 'Black', 30),
    ('650e8400-e29b-41d4-a716-446655440006', 'PB-GRY-OS', 'One Size', 'Gray', 30),
    
    -- Drop Shoulder Sweatshirt variants
    ('650e8400-e29b-41d4-a716-446655440007', 'DSS-GRN-S', 'S', 'Green', 10),
    ('650e8400-e29b-41d4-a716-446655440007', 'DSS-GRN-M', 'M', 'Green', 15),
    ('650e8400-e29b-41d4-a716-446655440007', 'DSS-GRN-L', 'L', 'Green', 12),
    ('650e8400-e29b-41d4-a716-446655440007', 'DSS-GRN-XL', 'XL', 'Green', 8),
    
    -- Wintery Gloves (one size)
    ('650e8400-e29b-41d4-a716-446655440008', 'WG-BLK-OS', 'One Size', 'Black', 20),
    ('650e8400-e29b-41d4-a716-446655440008', 'WG-GRY-OS', 'One Size', 'Gray', 20)
ON CONFLICT (sku) DO NOTHING;
