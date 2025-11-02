-- Verification script for partner_invitations table
-- Run this in Supabase SQL Editor to verify your setup

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'partner_invitations'
) AS table_exists;

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'partner_invitations'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'partner_invitations';

-- Check existing policies
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'partner_invitations';

-- If RLS is not enabled, run this:
-- ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;

-- If policies are missing, they should already be in 002_row_level_security.sql
-- Make sure you've run that migration!

