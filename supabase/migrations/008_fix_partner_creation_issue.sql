-- Diagnostic and fix script for partner relationship issues
-- Run this in Supabase SQL Editor to check and fix partner relationships

-- Check if there are any pending invitations that should have created partners
SELECT 
  pi.id as invitation_id,
  pi.from_user_id,
  pi.to_email,
  pi.status,
  pi.expires_at,
  pi.created_at,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users u 
      WHERE u.email = pi.to_email
    ) THEN 'User exists'
    ELSE 'User does not exist'
  END as user_status
FROM partner_invitations pi
WHERE pi.status = 'pending' OR pi.status = 'accepted'
ORDER BY pi.created_at DESC;

-- Check existing partner relationships
SELECT 
  p.id,
  p.user1_id,
  p.user2_id,
  p.status,
  p.initiated_by,
  p.created_at,
  u1.email as user1_email,
  u2.email as user2_email
FROM partners p
LEFT JOIN auth.users u1 ON u1.id = p.user1_id
LEFT JOIN auth.users u2 ON u2.id = p.user2_id
ORDER BY p.created_at DESC;

-- If you need to manually create a partner relationship:
-- Replace the UUIDs with actual user IDs
-- INSERT INTO partners (user1_id, user2_id, status, initiated_by)
-- VALUES (
--   'user1-uuid-here',
--   'user2-uuid-here',
--   'active',
--   'inviter-user-uuid-here'
-- );

-- Check RLS policies on partners table
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'partners'
ORDER BY policyname;

