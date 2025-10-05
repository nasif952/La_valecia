-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

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

-- Products policies (public read for active products)
CREATE POLICY "Active products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

-- Product images policies (public read)
CREATE POLICY "Product images are viewable by everyone" ON product_images
    FOR SELECT USING (true);

-- Product variants policies (public read)
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
    FOR SELECT USING (true);

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies (users can only see items from their own orders)
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Admin policies (bypass RLS for admin users)
-- Note: Admin role will be determined by checking user metadata
CREATE POLICY "Admin can do everything on profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on product_images" ON product_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on product_variants" ON product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );

CREATE POLICY "Admin can do everything on order_items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'admin')::boolean = true
        )
    );
