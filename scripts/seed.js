const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create admin user
    console.log('👤 Creating admin user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: process.env.ADMIN_EMAIL || 'admin@lavalecia.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email_confirm: true,
      user_metadata: {
        admin: true,
        name: 'Admin User'
      }
    })

    if (authError) {
      console.error('Error creating admin user:', authError)
    } else {
      console.log('✅ Admin user created:', authData.user.email)
    }

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Drop Shoulder', slug: 'drop-shoulder' },
      { name: 'Wintery', slug: 'wintery' },
      { name: 'Accessories', slug: 'accessories' }
    ]

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' })
      
      if (error) {
        console.error('Error creating category:', error)
      } else {
        console.log('✅ Category created:', category.name)
      }
    }

    // Create sample products
    console.log('👕 Creating sample products...')
    const products = [
      {
        name: 'Drop Shoulder Hoodie',
        slug: 'drop-shoulder-hoodie',
        description: 'Premium drop shoulder hoodie with modern fit and comfortable material. Perfect for casual wear and street style.',
        price_cents: 8900,
        primary_color: 'Black',
        fit: 'Oversized',
        material: 'Cotton Blend',
        care: 'Machine wash cold, tumble dry low',
        is_active: true
      },
      {
        name: 'Drop Shoulder T-Shirt',
        slug: 'drop-shoulder-tshirt',
        description: 'Classic drop shoulder t-shirt with premium cotton blend. Available in multiple colors and sizes.',
        price_cents: 3900,
        primary_color: 'White',
        fit: 'Oversized',
        material: '100% Cotton',
        care: 'Machine wash cold, tumble dry low',
        is_active: true
      },
      {
        name: 'Wintery Jacket',
        slug: 'wintery-jacket',
        description: 'Warm and stylish winter jacket with premium insulation. Perfect for cold weather and outdoor activities.',
        price_cents: 12900,
        primary_color: 'Navy',
        fit: 'Regular',
        material: 'Polyester Blend',
        care: 'Dry clean only',
        is_active: true
      },
      {
        name: 'Wintery Hoodie',
        slug: 'wintery-hoodie',
        description: 'Cozy winter hoodie with fleece lining. Great for layering or wearing alone on mild winter days.',
        price_cents: 6900,
        primary_color: 'Gray',
        fit: 'Regular',
        material: 'Fleece',
        care: 'Machine wash cold, tumble dry low',
        is_active: true
      },
      {
        name: 'Futuristic Cap',
        slug: 'futuristic-cap',
        description: 'Modern cap with futuristic design elements. Perfect accessory for completing your street style look.',
        price_cents: 2900,
        primary_color: 'Black',
        fit: 'One Size',
        material: 'Polyester',
        care: 'Hand wash, air dry',
        is_active: true
      },
      {
        name: 'Premium Beanie',
        slug: 'premium-beanie',
        description: 'Soft and warm beanie made from premium materials. Available in multiple colors.',
        price_cents: 1900,
        primary_color: 'Black',
        fit: 'One Size',
        material: 'Acrylic',
        care: 'Machine wash cold, air dry',
        is_active: true
      }
    ]

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'slug' })
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
      } else {
        console.log('✅ Product created:', product.name)

        // Create product images
        const imagePaths = [
          `${product.slug}-1.jpg`,
          `${product.slug}-2.jpg`
        ]

        for (let i = 0; i < imagePaths.length; i++) {
          const { error: imageError } = await supabase
            .from('product_images')
            .upsert({
              product_id: data.id,
              image_path: imagePaths[i],
              sort: i + 1
            })

          if (imageError) {
            console.error('Error creating product image:', imageError)
          }
        }

        // Create product variants
        const sizes = product.fit === 'One Size' ? ['One Size'] : ['S', 'M', 'L', 'XL']
        const colors = [product.primary_color, 'White', 'Gray'].filter((color, index, arr) => arr.indexOf(color) === index)

        for (const size of sizes) {
          for (const color of colors) {
            const sku = `${product.slug.substring(0, 3).toUpperCase()}-${size}-${color.substring(0, 3).toUpperCase()}`
            
            const { error: variantError } = await supabase
              .from('product_variants')
              .upsert({
                product_id: data.id,
                sku: sku,
                size: size,
                color: color,
                stock: Math.floor(Math.random() * 20) + 5 // Random stock between 5-25
              }, { onConflict: 'sku' })

            if (variantError) {
              console.error('Error creating product variant:', variantError)
            }
          }
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Run the development server: npm run dev')
    console.log('2. Visit http://localhost:3000')
    console.log('3. Sign in with admin credentials:')
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@lavalecia.com'}`)
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`)
    console.log('4. Access admin panel at /admin')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
