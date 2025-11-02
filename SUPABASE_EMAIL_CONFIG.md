# Supabase Email Configuration Guide

## Problem
Email verification links redirect to `localhost` instead of your deployed Vercel URL.

## Solution
You need to configure the redirect URLs in your Supabase project settings.

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard

1. Log in to [supabase.com](https://supabase.com)
2. Select your project

### 2. Navigate to Authentication Settings

1. Go to **Authentication** in the left sidebar
2. Click on **URL Configuration** (or **Settings** → **Auth**)

### 3. Update Site URL

1. Find the **Site URL** field
2. Replace `http://localhost:3000` with your Vercel deployment URL:
   ```
   https://your-project.vercel.app
   ```
3. Click **Save**

### 4. Add Redirect URLs

1. Scroll down to **Redirect URLs**
2. Add your production URLs:
   ```
   https://your-project.vercel.app/**
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/signup
   https://your-project.vercel.app/login
   ```

   Or use a wildcard:
   ```
   https://your-project.vercel.app/**
   ```

3. Click **Save**

### 5. Email Templates (Optional)

If you want to customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Update the **Confirm Signup** template
3. Make sure the confirmation link uses `{{ .SiteURL }}` or your Vercel URL

### 6. Environment Variables (Optional)

For better control, you can also add an environment variable in Vercel:

1. Go to Vercel Project Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

This will be used by the invitation link generator.

### Current Configuration Should Be:

```
Site URL: https://your-project.vercel.app
Redirect URLs: 
  - http://localhost:3000/**
  - https://your-project.vercel.app/**
```

### Testing

After updating:

1. Send a new invitation from the deployed app
2. Check the invitation link - it should use your Vercel URL
3. When a user clicks email verification, it should redirect to your Vercel URL

### Troubleshooting

**Still redirecting to localhost?**
- Clear your browser cache
- Make sure you saved the changes in Supabase
- Wait a few minutes for changes to propagate
- Check that you're using the correct Supabase project

**Preview deployments (branch deployments)?**
- You can add multiple redirect URLs for different environments:
  ```
  https://your-project.vercel.app/**
  https://your-project-git-main-yourname.vercel.app/**
  ```

**Custom domain?**
- Add your custom domain URLs too:
  ```
  https://yourdomain.com/**
  ```

---

**Important:** After making these changes, new email verifications will use the correct URL. Existing users who haven't verified will need to request a new verification email.

