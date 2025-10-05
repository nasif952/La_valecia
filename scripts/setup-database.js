const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment variables:')
console.log('SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing')
console.log('SERVICE_ROLE_KEY:', serviceRoleKey ? 'Found' : 'Missing')

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupDatabase() {
  console.log('🚀 Setting up La Valecia database...')
  
  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...')
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('📋 Database tables need to be created.')
      console.log('')
      console.log('Please run the following SQL in your Supabase dashboard:')
      console.log('')
      console.log('1. Go to: https://supabase.com/dashboard/project/aqumkxqcltxekdiolvui/sql')
      console.log('2. Copy and paste the SQL from: supabase/migrations/001_initial_schema.sql')
      console.log('3. Run the SQL')
      console.log('4. Then run: supabase/migrations/002_rls_policies.sql')
      console.log('5. Finally run: supabase/migrations/003_seed_data.sql')
      console.log('')
      console.log('Or run this script again after creating the tables.')
    } else if (error) {
      console.error('❌ Database connection error:', error)
    } else {
      console.log('✅ Database connection successful!')
      console.log('📊 Tables already exist, you can proceed with seeding data.')
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
  }
}

setupDatabase()