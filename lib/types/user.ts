export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  partner_id: string | null;
}

export interface Partner {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'active' | 'blocked';
  initiated_by: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerInvitation {
  id: string;
  from_user_id: string;
  to_email: string;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
  created_at: string;
}

