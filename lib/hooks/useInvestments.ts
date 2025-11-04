'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Investment, InvestmentType, InvestmentFormData, InvestmentFilters } from '@/lib/types/investment';

export function useInvestments(filters?: InvestmentFilters) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const fetchInvestmentTypes = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('investment_types')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setInvestmentTypes(data || []);
    } catch (err) {
      console.error('Error fetching investment types:', err);
    }
  }, [supabase]);

  const fetchInvestments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null);

      if (filters?.investment_type_id) {
        query = query.eq('investment_type_id', filters.investment_type_id);
      }

      if (filters?.transaction_type) {
        query = query.eq('transaction_type', filters.transaction_type);
      }

      if (filters?.start_date) {
        query = query.gte('date', filters.start_date);
      }

      if (filters?.end_date) {
        query = query.lte('date', filters.end_date);
      }

      query = query.order('date', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setInvestments(data || []);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, filters]);

  useEffect(() => {
    fetchInvestmentTypes();
  }, [fetchInvestmentTypes]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchInvestments();
  }, [user, fetchInvestments]);

  const addInvestment = async (investmentData: InvestmentFormData): Promise<Investment | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('investments')
        .insert({
          ...investmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchInvestments();
      return data;
    } catch (err) {
      console.error('Error adding investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add investment');
      return null;
    }
  };

  const updateInvestment = async (id: string, investmentData: Partial<InvestmentFormData>): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('investments')
        .update(investmentData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchInvestments();
      return true;
    } catch (err) {
      console.error('Error updating investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update investment');
      return false;
    }
  };

  const deleteInvestment = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('investments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchInvestments();
      return true;
    } catch (err) {
      console.error('Error deleting investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete investment');
      return false;
    }
  };

  return {
    investments,
    investmentTypes,
    loading,
    error,
    refetch: fetchInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  };
}

