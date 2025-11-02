'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SignupPageContent() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingInvitation, setCheckingInvitation] = useState(true);
  const [invitationValid, setInvitationValid] = useState<boolean | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<{ fromEmail?: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Get invitation token from URL
  const invitationToken = searchParams?.get('token') || null;

  useEffect(() => {
    checkInvitationRequirement();
  }, []);

  const checkInvitationRequirement = async () => {
    try {
      // Check if there are any users in the system
      const { data: users, error: usersError } = await supabase
        .from('partners')
        .select('user1_id, user2_id')
        .limit(1);

      // If we can't check via partners, try checking if we can query auth.users
      // For now, we'll check if invitation token is provided
      // If no token and no way to verify, we'll allow signup (first user case)

      if (invitationToken) {
        // Validate invitation token
        const { data: invitation, error: invError } = await supabase
          .from('partner_invitations')
          .select('*, from_user_id, to_email, expires_at, status')
          .eq('token', invitationToken)
          .single();

        if (invError || !invitation) {
          setInvitationValid(false);
          setError('Invalid or expired invitation token.');
        } else {
          const now = new Date();
          const expiresAt = new Date(invitation.expires_at);

          if (invitation.status !== 'pending') {
            setInvitationValid(false);
            setError(`This invitation has been ${invitation.status}.`);
          } else if (expiresAt < now) {
            setInvitationValid(false);
            setError('This invitation has expired.');
          } else {
            setInvitationValid(true);
            // Pre-fill email if it matches invitation
            if (invitation.to_email) {
              setEmail(invitation.to_email);
            }
            setInvitationInfo({});
          }
        }
      } else {
        // No token provided - check if there are existing users
        // We'll allow signup but this might be the first user
        // In production, you might want a more robust check
        setInvitationValid(true); // Allow signup if no token (first user scenario)
      }
    } catch (err) {
      console.error('Error checking invitation:', err);
      // On error, allow signup (assuming first user)
      setInvitationValid(true);
    } finally {
      setCheckingInvitation(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If invitation token is required, validate it
      if (invitationToken && !invitationValid) {
        setError('Please use a valid invitation link to sign up.');
        setLoading(false);
        return;
      }

      // Create user account
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (!signupData.user) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // If signup was via invitation, create partner relationship
      if (invitationToken && invitationValid) {
        const { data: invitation } = await supabase
          .from('partner_invitations')
          .select('from_user_id')
          .eq('token', invitationToken)
          .single();

        if (invitation) {
          // Determine user1 and user2 (lower UUID first for consistency)
          const userId1 = invitation.from_user_id < signupData.user.id 
            ? invitation.from_user_id 
            : signupData.user.id;
          const userId2 = invitation.from_user_id < signupData.user.id 
            ? signupData.user.id 
            : invitation.from_user_id;

          // Create partner relationship
          const { data: partnerData, error: partnerError } = await supabase
            .from('partners')
            .insert({
              user1_id: userId1,
              user2_id: userId2,
              status: 'active',
              initiated_by: invitation.from_user_id,
            })
            .select()
            .single();

          if (partnerError) {
            console.error('Error creating partner relationship:', partnerError);
            // Log detailed error for debugging
            console.error('Partner creation details:', {
              userId1,
              userId2,
              currentUserId: signupData.user.id,
              invitationFromUserId: invitation.from_user_id,
              error: partnerError,
            });
            // Still continue with signup, but show a warning
            setError('Account created successfully, but partner linking failed. Please contact support or try linking manually from Settings.');
          } else if (partnerData) {
            console.log('Partner relationship created successfully:', partnerData);
          }

          // Mark invitation as accepted
          const { error: updateError } = await supabase
            .from('partner_invitations')
            .update({ status: 'accepted' })
            .eq('token', invitationToken);
          
          if (updateError) {
            console.error('Error updating invitation status:', updateError);
          }
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (checkingInvitation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Validating invitation...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invitationToken && !invitationValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-red-600 dark:text-red-400">
            {error || 'Please contact your partner for a new invitation link.'}
          </div>
          <div className="text-center">
            <Link href="/login">
              <Button variant="outline">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Success!</CardTitle>
          <CardDescription>
            Your account has been created. Redirecting...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          {invitationToken 
            ? invitationInfo?.fromEmail 
              ? `You've been invited by ${invitationInfo.fromEmail}. Create your account to join them.`
              : 'Create your account with your invitation.'
            : 'Create a new account to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!invitationToken && (
          <div className="mb-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> This site is invitation-only. If you already have an account, please{' '}
              <Link href="/login" className="underline font-medium">
                sign in
              </Link>
              . To invite your partner, sign up first, then send them an invitation from the settings page.
            </p>
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    }>
      <SignupPageContent />
    </Suspense>
  );
}
