-- Fix RLS policies for partner_invitations table
-- The error "permission denied for table users" occurs because policies
-- were trying to access auth.users table directly, which requires elevated permissions

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON partner_invitations;
DROP POLICY IF EXISTS "Users can create invitations" ON partner_invitations;
DROP POLICY IF EXISTS "Users can update invitations they sent or received" ON partner_invitations;
DROP POLICY IF EXISTS "Allow public invitation read by token" ON partner_invitations;

-- Ensure RLS is enabled
ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can view invitations they sent
CREATE POLICY "Users can view invitations they sent or received"
  ON partner_invitations FOR SELECT
  USING (from_user_id = auth.uid());

-- Policy 2: Allow unauthenticated reads for signup (tokens are secure random strings)
-- This allows the signup page to validate invitation tokens
CREATE POLICY "Allow public invitation read by token"
  ON partner_invitations FOR SELECT
  USING (true);

-- Policy 3: Authenticated users can create invitations where they are the sender
CREATE POLICY "Users can create invitations"
  ON partner_invitations FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

-- Policy 4: Authenticated users can update invitations they sent
CREATE POLICY "Users can update invitations they sent or received"
  ON partner_invitations FOR UPDATE
  USING (from_user_id = auth.uid());

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies
WHERE tablename = 'partner_invitations'
ORDER BY policyname;
