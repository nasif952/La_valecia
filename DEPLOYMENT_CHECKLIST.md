# 🚀 GitHub + Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (if any)
- [ ] No console.log statements in production code

### 2. Environment Variables
- [ ] `.env.local` file exists for local development
- [ ] `env.example` file is up to date with all required variables
- [ ] No sensitive data in code (all in environment variables)
- [ ] Environment variables documented in README

### 3. File Structure
- [ ] `.gitignore` properly configured
- [ ] No unnecessary files in repository
- [ ] All required files present:
  - [ ] `package.json` with correct scripts
  - [ ] `next.config.js` properly configured
  - [ ] `vercel.json` (if custom config needed)
  - [ ] `tsconfig.json`
  - [ ] `tailwind.config.js`

### 4. Database & External Services
- [ ] Supabase project configured
- [ ] Database migrations ready
- [ ] RLS policies implemented
- [ ] Storage buckets configured
- [ ] API keys obtained (OpenAI, payments, etc.)

## 🔧 GitHub Setup

### 1. Repository Preparation
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: La Valecia e-commerce platform"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/la-valecia.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Repository Settings
- [ ] Repository is public (or Vercel has access)
- [ ] Main branch is `main`
- [ ] Branch protection rules configured (optional)
- [ ] Issues and PRs enabled

## ⚡ Vercel Deployment

### 1. Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### 2. Configure Project Settings
- [ ] Project name: `la-valecia-ecommerce`
- [ ] Framework: Next.js (auto-detected)
- [ ] Root directory: `./` (default)
- [ ] Build command: `npm run build` (auto-detected)
- [ ] Output directory: `.next` (auto-detected)
- [ ] Install command: `npm install` (auto-detected)

### 3. Environment Variables Setup
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aqumkxqcltxekdiolvui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdW1reHFjbHR4ZWtkaW9sdnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDI4OTYsImV4cCI6MjA3MzkxODg5Nn0.WgD7RRjp1UIB0PbNgeSm1K4aryRA4KR9F0d8KBae8EI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdW1reHFjbHR4ZWtkaW9sdnVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM0Mjg5NiwiZXhwIjoyMDczOTE4ODk2fQ.JBeoYGWvRoYFYiChEcPQ8lINYELw5x_r9xpkf8ddqYQ

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://la-valecia-ecommerce.vercel.app

# Admin User
ADMIN_EMAIL=admin@lavalecia.com
ADMIN_PASSWORD=admin123

# Optional: OpenAI for Chatbot
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Deployment Settings
- [ ] Set environment variables for all environments (Production, Preview, Development)
- [ ] Disable deployment protection (make public)
- [ ] Configure custom domain (optional)
- [ ] Set up automatic deployments from main branch

## 🧪 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Product catalog displays
- [ ] Product detail pages work
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] Authentication works

### 2. API Endpoints
- [ ] `/api/chat` responds correctly
- [ ] `/api/placeholder/400/500` generates placeholder images
- [ ] Payment endpoints return mock responses
- [ ] All API routes return proper status codes

### 3. Database Integration
- [ ] Supabase connection established
- [ ] Products load from database
- [ ] User authentication works
- [ ] Cart persistence works
- [ ] Order creation works

### 4. Performance
- [ ] Page load times are acceptable
- [ ] Images load correctly
- [ ] No console errors
- [ ] Mobile responsiveness works

## 🔍 Troubleshooting Common Issues

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compilation passes
- Check for missing environment variables

### 404 Errors
- Verify all pages are in correct `src/app/` structure
- Check API routes are in `src/app/api/`
- Ensure no hardcoded localhost URLs

### Database Connection Issues
- Verify Supabase environment variables
- Check Supabase project is active
- Ensure RLS policies allow public access where needed

### Authentication Issues
- Check Supabase Auth settings
- Verify redirect URLs are configured
- Ensure environment variables are set correctly

## 📋 Final Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project connected to GitHub
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] All functionality tested
- [ ] Custom domain configured (optional)
- [ ] Analytics/monitoring set up (optional)
- [ ] Documentation updated

## 🎉 Success!

Your La Valecia e-commerce platform should now be live and accessible at:
- **Production URL**: https://la-valecia-ecommerce.vercel.app
- **GitHub Repository**: https://github.com/YOUR_USERNAME/la-valecia

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this checklist
3. Check GitHub repository settings
4. Verify environment variables
5. Test locally first
