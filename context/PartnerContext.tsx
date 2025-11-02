'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import { Partner } from '@/lib/types/user';

interface PartnerContextType {
  partner: Partner | null;
  loading: boolean;
  refreshPartner: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!user) {
      setPartner(null);
      setLoading(false);
      return;
    }

    fetchPartner();
  }, [user]);

  const fetchPartner = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching partner:', error);
      }

      setPartner(data || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partner:', error);
      setPartner(null);
      setLoading(false);
    }
  };

  const refreshPartner = async () => {
    await fetchPartner();
  };

  return (
    <PartnerContext.Provider value={{ partner, loading, refreshPartner }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
}

