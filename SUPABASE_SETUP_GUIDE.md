# 🚀 La Valecia Supabase Setup Guide

This guide will help you set up the complete Supabase configuration for your La Valecia e-commerce platform.

## 📋 **Prerequisites**

- ✅ Supabase project created: `aqumkxqcltxekdiolvui`
- ✅ Environment variables configured in `.env.local`
- ✅ Project running on http://localhost:3000

## 🗄️ **Step 1: Database Setup**

### 1.1 Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/sql
2. Click "New Query"

### 1.2 Run Database Setup Script
1. Copy the entire contents of `supabase-setup.sql` file
2. Paste it into the SQL Editor
3. Click "Run" to execute the script

**This will create:**
- ✅ All database tables (profiles, products, categories, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Database functions and triggers
- ✅ Sample product data with your real images
- ✅ User profile creation on signup

## 🔐 **Step 2: Authentication Setup**

### 2.1 Configure Email Authentication
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/auth/providers
2. Under "Email" section:
   - ✅ Enable "Enable email confirmations" (recommended for production)
   - ✅ Set "Confirm email" to your domain (optional for development)
   - ✅ Configure "Email templates" if needed

### 2.2 Configure OAuth (Optional)
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/auth/providers
2. Under "Google" section:
   - ✅ Enable Google provider
   - ✅ Add your Google OAuth credentials
   - ✅ Set redirect URL: `http://localhost:3000/auth/callback`

### 2.3 Configure Site URL
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/auth/url-configuration
2. Set "Site URL" to: `http://localhost:3000`
3. Add "Redirect URLs":
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**` (for development)

## 🛡️ **Step 3: Row Level Security (RLS)**

The RLS policies are automatically created by the setup script, but you can verify them:

### 3.1 Check RLS Policies
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/auth/policies
2. Verify these policies exist:
   - ✅ `profiles`: Users can view/update own profile
   - ✅ `products`: Public read access
   - ✅ `orders`: Users can view own orders
   - ✅ `cart_items`: Users can manage own cart
   - ✅ `wishlist`: Users can manage own wishlist

## 🧪 **Step 4: Test Authentication**

### 4.1 Test User Registration
1. Go to: http://localhost:3000/auth/register
2. Fill out the registration form
3. Check your email for verification (if enabled)
4. Verify user appears in: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/auth/users

### 4.2 Test User Login
1. Go to: http://localhost:3000/auth/login
2. Use the credentials you just created
3. Verify successful login and redirect

### 4.3 Test Profile Creation
1. After login, check: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/table-editor/profiles
2. Verify a profile was automatically created for your user

## 📊 **Step 5: Verify Product Data**

### 5.1 Check Products Table
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/table-editor/products
2. Verify all 9 drop shoulder products are created
3. Check product images are properly linked

### 5.2 Check Product Variants
1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/table-editor/product_variants
2. Verify variants with sizes and colors are created
3. Check stock quantities are set

## 🔧 **Step 6: Environment Variables**

Your `.env.local` file should contain:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aqumkxqcltxekdiolvui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin User (for seeding)
ADMIN_EMAIL=admin@lavalecia.com
ADMIN_PASSWORD=241120
```

## 🚀 **Step 7: Test Complete Flow**

### 7.1 Test Product Catalog
1. Go to: http://localhost:3000/catalog
2. Verify all 9 products display with real images
3. Test filtering and search functionality

### 7.2 Test User Features
1. Register a new account
2. Login and verify profile access
3. Test cart functionality (if implemented)
4. Test wishlist functionality (if implemented)

### 7.3 Test Admin Features
1. Login with admin credentials
2. Go to: http://localhost:3000/admin
3. Verify admin dashboard access

## 🐛 **Troubleshooting**

### Common Issues:

**1. "Invalid login credentials"**
- Check email/password are correct
- Verify user exists in Supabase Auth dashboard
- Check if email verification is required

**2. "Row Level Security policy violation"**
- Verify RLS policies are properly set up
- Check user is authenticated
- Verify user has correct permissions

**3. "Profile not found"**
- Check if profile was created on signup
- Verify the trigger function is working
- Manually create profile if needed

**4. "Products not loading"**
- Check products table has data
- Verify product_images table has entries
- Check image paths are correct

## 📞 **Support**

If you encounter any issues:
1. Check the Supabase dashboard logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure database setup script ran successfully

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ Users can register and login
- ✅ Profiles are automatically created
- ✅ Products display with real images
- ✅ Catalog filtering works
- ✅ Admin dashboard is accessible
- ✅ No console errors in browser

---

**Your La Valecia e-commerce platform is now fully configured with Supabase!** 🚀
