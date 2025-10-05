-- La Valecia E-commerce Database Setup
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/sql

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'Bangladesh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BDT',
  primary_color TEXT,
  fit TEXT,
  material TEXT,
  care TEXT,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  alt_text TEXT,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  price_cents INTEGER, -- Override product price if different
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BDT',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'bkash')),
  bkash_txn_id TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  qty INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create cart_items table (for guest and user carts)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- For guest users
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

-- Product images policies (public read)
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

-- Product variants policies (public read)
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Cart items policies
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- 12. Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'LV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Insert sample data

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Drop Shoulder', 'drop-shoulder', 'Premium drop shoulder hoodies and sweatshirts'),
('Wintery', 'wintery', 'Winter essentials and warm clothing'),
('Accessories', 'accessories', 'Fashion accessories and add-ons')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price_cents, category_id, primary_color, fit, material, care) VALUES
('Drop Shoulder Hoodie - Classic', 'drop-shoulder-hoodie-classic', 'Premium quality drop shoulder hoodie with modern fit', 8900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Black', 'Oversized', '100% Cotton', 'Machine wash cold'),
('Drop Shoulder Hoodie - Premium', 'drop-shoulder-hoodie-premium', 'High-end drop shoulder hoodie with premium materials', 12900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Navy', 'Oversized', 'Premium Cotton Blend', 'Hand wash recommended'),
('Drop Shoulder Hoodie - Modern', 'drop-shoulder-hoodie-modern', 'Contemporary design with comfortable fit', 9900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Gray', 'Regular', 'Organic Cotton', 'Machine wash cold'),
('Drop Shoulder Hoodie - Elite', 'drop-shoulder-hoodie-elite', 'Elite collection with superior craftsmanship', 11900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Black', 'Oversized', 'Premium Cotton', 'Dry clean only'),
('Drop Shoulder Hoodie - Signature', 'drop-shoulder-hoodie-signature', 'Signature design with unique details', 10900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'White', 'Regular', 'Cotton Blend', 'Machine wash cold'),
('Drop Shoulder Hoodie - Limited', 'drop-shoulder-hoodie-limited', 'Limited edition with exclusive design', 13900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Red', 'Oversized', 'Premium Materials', 'Hand wash only'),
('Drop Shoulder Hoodie - Essential', 'drop-shoulder-hoodie-essential', 'Essential everyday hoodie', 7900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Black', 'Regular', 'Cotton', 'Machine wash cold'),
('Drop Shoulder Hoodie - Pro', 'drop-shoulder-hoodie-pro', 'Professional grade hoodie', 11900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Blue', 'Regular', 'Performance Cotton', 'Machine wash cold'),
('Drop Shoulder Hoodie - Ultimate', 'drop-shoulder-hoodie-ultimate', 'Ultimate luxury hoodie', 14900, (SELECT id FROM categories WHERE slug = 'drop-shoulder'), 'Black', 'Oversized', 'Luxury Cotton', 'Dry clean only')
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_path, alt_text, sort) VALUES
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), '/images/products/drop-shoulder-1.jpg', 'Drop Shoulder Hoodie - Classic', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), '/images/products/drop-shoulder-2.jpg', 'Drop Shoulder Hoodie - Premium', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-modern'), '/images/products/drop-shoulder-3.jpg', 'Drop Shoulder Hoodie - Modern', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-elite'), '/images/products/drop-shoulder-4.jpg', 'Drop Shoulder Hoodie - Elite', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-signature'), '/images/products/drop-shoulder-5.jpg', 'Drop Shoulder Hoodie - Signature', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-limited'), '/images/products/drop-shoulder-6.jpg', 'Drop Shoulder Hoodie - Limited', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-essential'), '/images/products/drop-shoulder-7.jpg', 'Drop Shoulder Hoodie - Essential', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-pro'), '/images/products/drop-shoulder-8.jpg', 'Drop Shoulder Hoodie - Pro', 1),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-ultimate'), '/images/products/drop-shoulder-9.jpg', 'Drop Shoulder Hoodie - Ultimate', 1)
ON CONFLICT DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, sku, size, color, stock) VALUES
-- Classic variants
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-S-BLK', 'S', 'Black', 10),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-M-BLK', 'M', 'Black', 15),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-L-BLK', 'L', 'Black', 12),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-XL-BLK', 'XL', 'Black', 8),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-S-WHT', 'S', 'White', 10),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-M-WHT', 'M', 'White', 15),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-L-WHT', 'L', 'White', 12),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-classic'), 'DS-CLASSIC-XL-WHT', 'XL', 'White', 8),
-- Premium variants
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-M-BLK', 'M', 'Black', 8),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-L-BLK', 'L', 'Black', 10),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-XL-BLK', 'XL', 'Black', 6),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-XXL-BLK', 'XXL', 'Black', 4),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-M-NAVY', 'M', 'Navy', 8),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-L-NAVY', 'L', 'Navy', 10),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-XL-NAVY', 'XL', 'Navy', 6),
((SELECT id FROM products WHERE slug = 'drop-shoulder-hoodie-premium'), 'DS-PREMIUM-XXL-NAVY', 'XXL', 'Navy', 4)
ON CONFLICT (sku) DO NOTHING;

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- 15. Create admin user (you can change the email and password)
-- Note: This will create a user in auth.users table
-- You'll need to set the password through Supabase Auth dashboard or use the signup flow

COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE products IS 'Product catalog';
COMMENT ON TABLE product_images IS 'Product images';
COMMENT ON TABLE product_variants IS 'Product variants (size, color, stock)';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Items in each order';
COMMENT ON TABLE cart_items IS 'Shopping cart items';
COMMENT ON TABLE wishlist IS 'User wishlist items';
