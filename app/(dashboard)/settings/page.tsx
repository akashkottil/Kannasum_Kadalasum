'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, X, Mail, UserPlus, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { partner, refreshPartner } = usePartner();
  const supabase = createClient();

  const [invitationEmail, setInvitationEmail] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateInvitationToken = () => {
    // Generate a secure random token (64 characters hex)
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side or environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !invitationEmail) return;

    setError('');
    setSendingInvitation(true);
    setInvitationSent(false);

    try {
      // Check if user already has a partner
      if (partner) {
        setError('You already have a partner linked. Please remove the existing partnership first.');
        setSendingInvitation(false);
        return;
      }

      // Check if email is the same as current user
      if (invitationEmail.toLowerCase() === user.email?.toLowerCase()) {
        setError('You cannot invite yourself.');
        setSendingInvitation(false);
        return;
      }

      // Generate invitation token
      const token = generateInvitationToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(invitationEmail)) {
        setError('Please enter a valid email address.');
        setSendingInvitation(false);
        return;
      }

      // Create invitation
      const { data, error: invError } = await supabase
        .from('partner_invitations')
        .insert({
          from_user_id: user.id,
          to_email: invitationEmail.toLowerCase().trim(),
          token: token,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (invError) {
        console.error('Supabase error details:', invError);
        throw invError;
      }

      if (!data) {
        throw new Error('No data returned from invitation creation');
      }

      // Generate invitation link
      // Use environment variable for production, fallback to window.location for development
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const link = `${baseUrl}/signup?token=${token}`;
      setInvitationLink(link);
      setInvitationSent(true);
      setInvitationEmail('');
    } catch (err: any) {
      console.error('Error sending invitation:', err);
      // Show more detailed error message
      let errorMessage = 'Failed to send invitation. Please try again.';
      
      if (err?.code === '23505') {
        errorMessage = 'An invitation with this token already exists. Please try again.';
      } else if (err?.code === '42501') {
        errorMessage = 'Permission denied. Please check your database permissions.';
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSendingInvitation(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get partner email for display (simplified - showing partner relationship exists)
  const partnerEmail = partner 
    ? (partner.user1_id === user?.id ? 'Partner' : 'Partner') 
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Partner Management */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Management</CardTitle>
          <CardDescription>
            {partner 
              ? 'You are linked with your partner. You can view and manage shared expenses.'
              : 'Invite your partner to start sharing expenses together'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {partner ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Partner Linked
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You can now share expenses and view analytics together.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await refreshPartner();
                  window.location.reload();
                }}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Partner Status
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Refresh button for users waiting for partner */}
              <Button
                variant="outline"
                onClick={async () => {
                  await refreshPartner();
                  // Force a re-check by querying directly
                  const { data: partnerData } = await supabase
                    .from('partners')
                    .select('*')
                    .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
                    .eq('status', 'active')
                    .single();
                  
                  if (partnerData) {
                    await refreshPartner();
                    alert('Partner found! Refreshing page...');
                    window.location.reload();
                  } else {
                    alert('No partner linked yet. Make sure your partner has signed up using the invitation link you sent them. If they already signed up, the partner relationship might not have been created. Check the browser console for errors.');
                  }
                }}
                className="w-full mb-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Partner Status
              </Button>
            <div className="space-y-4">
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invitationEmail">Partner Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invitationEmail"
                      type="email"
                      placeholder="partner@example.com"
                      value={invitationEmail}
                      onChange={(e) => setInvitationEmail(e.target.value)}
                      required
                      disabled={sendingInvitation}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sendingInvitation}>
                      {sendingInvitation ? (
                        'Sending...'
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">{error}</p>
                    <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                      <strong>Debug tip:</strong> Check the browser console (F12) for detailed error information. 
                      Make sure you've run all database migrations including RLS policies.
                    </p>
                  </div>
                )}

                {invitationSent && invitationLink && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Invitation Sent!
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Share this link with your partner. They need to sign up using this link.
                        </p>
                        <div className="flex items-center gap-2">
                          <Input
                            value={invitationLink}
                            readOnly
                            className="flex-1 font-mono text-xs bg-white dark:bg-gray-800"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="shrink-0"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> Your partner will need to create an account using the invitation link. 
                  Once they sign up, you'll be automatically linked and can start sharing expenses.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Category management coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
