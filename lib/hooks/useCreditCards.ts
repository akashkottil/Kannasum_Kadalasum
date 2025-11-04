'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, CreditCardRepayment, CreditCardFormData, CreditCardRepaymentFormData } from '@/lib/types/credit-card';

export function useCreditCards() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [repayments, setRepayments] = useState<CreditCardRepayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const fetchCreditCards = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('card_name');

      if (fetchError) throw fetchError;

      setCreditCards(data || []);
    } catch (err) {
      console.error('Error fetching credit cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch credit cards');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const fetchRepayments = useCallback(async (cardId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('credit_card_repayments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (cardId) {
        query = query.eq('credit_card_id', cardId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRepayments(data || []);
    } catch (err) {
      console.error('Error fetching repayments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch repayments');
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCreditCards();
    fetchRepayments();
  }, [user, fetchCreditCards, fetchRepayments]);

  const addCreditCard = async (cardData: CreditCardFormData): Promise<CreditCard | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('credit_cards')
        .insert({
          ...cardData,
          user_id: user.id,
          current_balance: cardData.current_balance || 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchCreditCards();
      return data;
    } catch (err) {
      console.error('Error adding credit card:', err);
      setError(err instanceof Error ? err.message : 'Failed to add credit card');
      return null;
    }
  };

  const updateCreditCard = async (id: string, cardData: Partial<CreditCardFormData>): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('credit_cards')
        .update(cardData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchCreditCards();
      return true;
    } catch (err) {
      console.error('Error updating credit card:', err);
      setError(err instanceof Error ? err.message : 'Failed to update credit card');
      return false;
    }
  };

  const deleteCreditCard = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchCreditCards();
      return true;
    } catch (err) {
      console.error('Error deleting credit card:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete credit card');
      return false;
    }
  };

  const addRepayment = async (repaymentData: CreditCardRepaymentFormData): Promise<CreditCardRepayment | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('credit_card_repayments')
        .insert({
          ...repaymentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update credit card balance
      const card = creditCards.find(c => c.id === repaymentData.credit_card_id);
      if (card) {
        const newBalance = Math.max(0, (card.current_balance || 0) - repaymentData.amount);
        await updateCreditCard(repaymentData.credit_card_id, { current_balance: newBalance });
      }

      await fetchRepayments();
      return data;
    } catch (err) {
      console.error('Error adding repayment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add repayment');
      return null;
    }
  };

  const updateRepayment = async (id: string, repaymentData: Partial<CreditCardRepaymentFormData>): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('credit_card_repayments')
        .update(repaymentData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchRepayments();
      return true;
    } catch (err) {
      console.error('Error updating repayment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update repayment');
      return false;
    }
  };

  const deleteRepayment = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('credit_card_repayments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchRepayments();
      return true;
    } catch (err) {
      console.error('Error deleting repayment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete repayment');
      return false;
    }
  };

  return {
    creditCards,
    repayments,
    loading,
    error,
    refetchCards: fetchCreditCards,
    refetchRepayments: fetchRepayments,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addRepayment,
    updateRepayment,
    deleteRepayment,
  };
}

