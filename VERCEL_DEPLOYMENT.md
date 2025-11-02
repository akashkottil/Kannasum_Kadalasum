# Vercel Deployment Guide

This guide will help you deploy your Expense Tracker application to Vercel.

## Prerequisites

- ✅ Code pushed to GitHub repository
- ✅ Supabase project created and configured
- ✅ All database migrations run
- ✅ Environment variables ready

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the repository (`Kannasum_Kadalasum` or your repo name)

## Step 2: Configure Project Settings

### Framework Preset
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `expense-tracker` (if your project is in a subfolder)
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.next` (default)

### Environment Variables

Add these environment variables in Vercel project settings:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Important:** Replace `your-project.vercel.app` with your actual Vercel deployment URL.

**Where to find Supabase credentials:**
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Important Notes:
- Make sure to add these variables for **Production**, **Preview**, and **Development** environments
- The variable names must match exactly (case-sensitive)
- Never commit these values to git (they're already in `.gitignore`)

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Step 4: Configure Supabase Email Redirects

**CRITICAL:** After deployment, you must update Supabase redirect URLs:

1. Go to your Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-project.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://your-project.vercel.app/**
   ```
4. Click **Save**

**Why?** Without this, email verification links will redirect to localhost instead of your deployed site.

See [SUPABASE_EMAIL_CONFIG.md](./SUPABASE_EMAIL_CONFIG.md) for detailed instructions.

## Step 5: Post-Deployment Checklist

### ✅ Verify Database Setup

Make sure you've run all migrations in your Supabase SQL Editor:

1. **Initial Schema** (`001_initial_schema.sql`)
   - Creates all tables (partners, categories, subcategories, expenses, partner_invitations)

2. **RLS Policies** (`002_row_level_security.sql`)
   - Sets up Row Level Security for all tables
   - **IMPORTANT**: Make sure the partner_invitations policies don't access `auth.users` table
   - If you have the old policies, run `006_fix_partner_invitations_rls.sql` to fix them

3. **Additional Migrations**:
   - `003_add_paid_by_field.sql` - Adds "who paid" field
   - `004_add_is_shared_field.sql` - Adds shared expense field

4. **Seed Data** (`supabase/config/seed.sql`)
   - Populates default categories and subcategories
   - Includes the new "Tea" subcategory

### ✅ Test the Application

1. Visit your deployed URL
2. Try signing up (first user should work without invitation)
3. Test partner invitation:
   - Go to Settings
   - Send invitation to partner email
   - Partner should signup using invitation link
4. Test expense features:
   - Add expense with "shared" checkbox
   - Mark "who paid"
   - Check analytics filters

## Step 5: Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

**Error: TypeScript errors**
- Run `npm run build` locally first to catch any TypeScript issues
- Fix errors before deploying

### Runtime Errors

**Error: "Permission denied for table users"**
- Run migration `006_fix_partner_invitations_rls.sql` in Supabase
- This fixes RLS policies that try to access `auth.users` table

**Error: "Table doesn't exist"**
- Make sure you've run all migrations in Supabase SQL Editor
- Check that tables exist: `partners`, `categories`, `subcategories`, `expenses`, `partner_invitations`

### Database Connection Issues

- Verify Supabase URL and key are correct in Vercel environment variables
- Check Supabase project is active and not paused
- Verify RLS policies are correctly set up

## Environment Variables Reference

```env
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches (for testing)

## Useful Vercel Features

- **Deployments**: View all deployments and rollback if needed
- **Analytics**: Monitor performance and traffic
- **Functions**: Serverless functions (if you add API routes)
- **Edge Config**: Fast configuration updates

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase dashboard for database errors
3. Check browser console for client-side errors
4. Verify all migrations have been run

---

**Your app should now be live on Vercel! 🚀**

