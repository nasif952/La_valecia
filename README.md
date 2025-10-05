# La Valecia - Premium Apparel E-commerce

A modern, full-stack e-commerce platform for the La Valecia apparel brand, built with Next.js, Supabase, and premium design principles.

## 🚀 Features

### Core E-commerce
- **Product Catalog** with advanced filtering (category, size, color, price)
- **Product Detail Pages** with image galleries and variant selection
- **Shopping Cart** with persistent storage
- **Checkout Flow** with dummy payment integration (Card & bKash)
- **Order Management** with status tracking

### User Experience
- **Authentication** (Email/Password + OAuth with Google)
- **User Profiles** with order history and saved items
- **Responsive Design** optimized for all devices
- **Premium Animations** with Framer Motion and GSAP
- **AI Chatbot** with OpenAI integration (configurable)

### Admin Features
- **Product Management** (CRUD operations)
- **Order Dashboard** with status pipeline
- **Inventory Management** with SKU tracking
- **Content Management** for home page sections

### Technical Features
- **Supabase Integration** (Auth, Database, Storage, RLS)
- **Row-Level Security** for data protection
- **Server-Side Rendering** with Next.js App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion, GSAP ScrollTrigger
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Dummy implementations (Stripe-like, bKash)
- **AI**: OpenAI API integration (optional)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key (optional, for chatbot)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd la-valecia
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key

# Admin User (for seeding)
ADMIN_EMAIL=admin@lavalecia.com
ADMIN_PASSWORD=admin123
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Run the database migrations:

```sql
-- Run the SQL files in supabase/migrations/ in order:
-- 1. 001_initial_schema.sql
-- 2. 002_rls_policies.sql
-- 3. 003_seed_data.sql
```

4. Enable Row Level Security on all tables
5. Set up Storage bucket named `product-images` for product photos

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄 Database Schema

### Core Tables

- **profiles** - User profile information
- **categories** - Product categories
- **products** - Product information
- **product_images** - Product image references
- **product_variants** - Size/color/stock variants
- **orders** - Order information
- **order_items** - Individual order line items

### Row Level Security (RLS)

- Users can read public product catalog
- Users can read/write their own profiles and orders
- Admin users have full access via metadata claims
- All tables have appropriate RLS policies

## 🎨 Design System

### Brand Colors
- **Primary**: Light Green (#90EE90) - matches profile picture
- **Secondary**: Dark Gray (#2D3748)
- **Accent**: Light Gray (#F7FAFC)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300-800
- **Style**: Modern, clean, premium

### Components
- **shadcn/ui** base components
- **Custom variants** for brand consistency
- **Rounded corners** (rounded-2xl)
- **Glass morphism** effects
- **Smooth animations** throughout

## 💳 Payment Integration

### Current Implementation (Dummy)
- **Card Payments**: Mock Stripe-like flow
- **bKash**: Mock bKash sandbox integration
- **API Routes**: `/api/payments/card/*` and `/api/payments/bkash/*`

### Switching to Real Payments

#### Stripe Integration
1. Get Stripe keys from [stripe.com](https://stripe.com)
2. Replace dummy endpoints with real Stripe API calls
3. Update environment variables:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

#### bKash Integration
1. Register at [bKash Developer Portal](https://developer.bkash.com)
2. Replace dummy endpoints with real bKash API calls
3. Update environment variables:
   ```env
   BKASH_APP_KEY=your_app_key
   BKASH_APP_SECRET=your_app_secret
   BKASH_USERNAME=your_username
   BKASH_PASSWORD=your_password
   ```

## 🤖 Chatbot Configuration

### OpenAI Integration
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add to environment variables:
   ```env
   OPENAI_API_KEY=sk-...
   ```
3. The chatbot will automatically use OpenAI when the key is present

### Mock Responses
When OpenAI is not configured, the chatbot provides helpful mock responses for:
- Product search and recommendations
- Size guides and fit information
- Shipping and delivery information
- Returns and exchanges
- Payment methods

## 👤 Admin Setup

### Creating Admin User
1. Sign up normally through the registration page
2. In Supabase Dashboard, go to Authentication > Users
3. Find your user and edit their metadata:
   ```json
   {
     "admin": true
   }
   ```
4. Access admin panel at `/admin`

### Admin Features
- **Product Management**: Add/edit/delete products and variants
- **Order Management**: View and update order statuses
- **Inventory Tracking**: Monitor stock levels
- **Content Management**: Update home page sections

## 🚀 Deployment

### GitHub + Vercel (Recommended)

#### 1. Push to GitHub
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: La Valecia e-commerce platform"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/la-valecia.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → "Import Git Repository"
3. Select your `la-valecia` repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables in Vercel dashboard (see below)
6. Click "Deploy"

#### 3. Environment Variables for Vercel
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aqumkxqcltxekdiolvui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdW1reHFjbHR4ZWtkaW9sdnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDI4OTYsImV4cCI6MjA3MzkxODg5Nn0.WgD7RRjp1UIB0PbNgeSm1K4aryRA4KR9F0d8KBae8EI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdW1reHFjbHR4ZWtkaW9sdnVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM0Mjg5NiwiZXhwIjoyMDczOTE4ODk2fQ.JBeoYGWvRoYFYiChEcPQ8lINYELw5x_r9xpkf8ddqYQ
NEXT_PUBLIC_SITE_URL=https://la-valecia-ecommerce.vercel.app
ADMIN_EMAIL=admin@lavalecia.com
ADMIN_PASSWORD=admin123
```

#### 4. Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Custom domains can be configured in Vercel settings

> 📋 **Complete deployment guide**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed instructions.

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Good for full-stack deployment
- **DigitalOcean**: App Platform support

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📁 Project Structure

```
la-valecia/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── catalog/        # Product catalog
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   └── admin/          # Admin panel
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── lib/               # Utilities and configs
│   ├── types/             # TypeScript types
│   └── hooks/             # Custom React hooks
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── ...                    # Config files
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style
- **ESLint** configuration included
- **Prettier** recommended for formatting
- **TypeScript** strict mode enabled
- **Import sorting** with path aliases

## 🔧 Customization

### Adding New Product Categories
1. Add to database: `INSERT INTO categories (name, slug) VALUES ('New Category', 'new-category')`
2. Update filter options in catalog page
3. Add category-specific styling if needed

### Modifying Brand Colors
1. Update CSS variables in `src/app/globals.css`
2. Modify Tailwind config in `tailwind.config.js`
3. Update component variants as needed

### Adding New Payment Methods
1. Create new API routes in `src/app/api/payments/`
2. Update checkout form with new payment option
3. Add payment method to database enum
4. Update order processing logic

## 🐛 Troubleshooting

### Common Issues

#### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured

#### Authentication Problems
- Clear browser storage and cookies
- Check Supabase Auth settings
- Verify redirect URLs are configured

#### Payment Integration Issues
- Test with dummy data first
- Check API endpoint responses
- Verify environment variables

#### Build Errors
- Run `npm run type-check` to identify TypeScript issues
- Clear `.next` folder and rebuild
- Check for missing dependencies

## 📞 Support

For issues and questions:
1. Check this README first
2. Review the code comments
3. Check Supabase documentation
4. Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Vercel** for Next.js and deployment
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

---

Built with ❤️ for La Valecia - Premium Apparel for the Modern Generation
