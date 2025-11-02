# Setup Guide

This guide will help you set up the Expense Tracker application from scratch.

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Supabase Account**: Free account at [supabase.com](https://supabase.com)

## Step 1: Clone or Navigate to Project

If you already have the project:
```bash
cd expense-tracker
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React & TypeScript
- Supabase client libraries
- Tailwind CSS
- Chart libraries
- UI dependencies

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: expense-tracker (or any name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient

### 3.2 Get Your API Keys

1. Once your project is created, go to **Settings** (gear icon)
2. Click on **API**
3. Copy these values:
   - **Project URL** (under Project URL section)
   - **anon public** key (under Project API keys)

### 3.3 Configure Environment Variables

1. In the `expense-tracker` directory, create a `.env.local` file:
```bash
touch .env.local
```

2. Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values.

### 3.4 Set Up Database

1. In Supabase, go to **SQL Editor** (in the left sidebar)
2. We'll run 3 SQL scripts in order:

**Script 1: Create Tables**
- Copy the entire content of `supabase/migrations/001_initial_schema.sql`
- Paste into SQL Editor
- Click **Run** (or press Cmd/Ctrl + Enter)

**Script 2: Add Security**
- Copy the entire content of `supabase/migrations/002_row_level_security.sql`
- Paste into SQL Editor
- Click **Run**

**Script 3: Seed Default Categories**
- Copy the entire content of `supabase/config/seed.sql`
- Paste into SQL Editor
- Click **Run**

### 3.5 Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see 6 tables:
   - categories
   - expenses
   - partner_invitations
   - partners
   - subcategories
   - users (created by Supabase Auth)

3. Click on **categories** - you should see 8 default categories with icons and colors

## Step 4: Run Development Server

```bash
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

### 5.1 Create an Account

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign Up"
3. Fill in the signup form:
   - Full Name
   - Email
   - Password (minimum 6 characters)
4. Click "Sign Up"
5. You should be redirected to the dashboard

### 5.2 Explore the Dashboard

You should see:
- Dashboard page with stats (currently showing 0)
- Expenses page (empty)
- Analytics page (empty)
- Settings page

### 5.3 Test Theme Toggle

- Click the sun/moon icon in the top right
- The theme should switch between light and dark

### 5.4 Sign Out and Sign In

1. Click "Sign Out" in the sidebar
2. Sign in with your credentials
3. You should be taken back to the dashboard

## Step 6: (Optional) Test Partner Feature

To test partner linking, you'll need:

1. Create a second account with a different email
2. Go to Settings on both accounts
3. Use the partner invitation feature (to be implemented)

## Troubleshooting

### Build Fails

**Error**: "Your project's URL and API key are required"

**Solution**: Make sure `.env.local` exists and has the correct values from your Supabase project.

### Database Errors

**Error**: "relation does not exist"

**Solution**: Make sure you ran all 3 SQL migration scripts in the correct order.

### Cannot Sign In

**Error**: "Invalid login credentials"

**Solution**: Make sure you created an account via signup first. If using Supabase Auth, check that email confirmation is disabled in Supabase settings (for testing).

### Styling Issues

**Issue**: Theme not switching or styles broken

**Solution**: 
1. Clear browser cache
2. Restart the dev server
3. Check browser console for errors

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## File Structure

```
expense-tracker/
├── app/                      # Next.js pages & routes
│   ├── (auth)/              # Login & Signup
│   └── (dashboard)/         # Protected routes
├── components/              # React components
│   ├── ui/                  # Reusable UI
│   ├── shared/              # Shared components
│   └── ...                  # Feature components
├── context/                 # React contexts
├── lib/                     # Utilities & config
│   ├── supabase/           # Supabase clients
│   ├── types/              # TypeScript types
│   └── utils/              # Helper functions
├── supabase/               # Database files
│   ├── migrations/         # SQL migrations
│   └── config/             # Seed data
└── public/                 # Static assets
```

## Next Steps

Now that the app is running, check the `IMPLEMENTATION_STATUS.md` file to see what features are still being developed.

## Getting Help

- Check [README.md](./README.md) for project overview
- Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for feature status
- Open an issue on GitHub if you encounter problems

## Important Notes

⚠️ **Never commit `.env.local`** - it contains your API keys

✅ **Always commit** `supabase/migrations/` - database schema should be version controlled

🔒 Keep your Supabase credentials secure

📊 Default categories are pre-populated for convenience but can be customized

