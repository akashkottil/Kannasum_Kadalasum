'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PaymentSource } from '@/lib/types/payment-source';

export function usePaymentSources() {
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPaymentSources = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('payment_sources')
          .select('*')
          .order('type')
          .order('name');

        if (fetchError) throw fetchError;

        setPaymentSources(data || []);
      } catch (err) {
        console.error('Error fetching payment sources:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch payment sources');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSources();
  }, [supabase]);

  return {
    paymentSources,
    loading,
    error,
  };
}

