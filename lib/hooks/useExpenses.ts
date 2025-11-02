'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';
import { Expense, ExpenseFormData, ExpenseFilters } from '@/lib/types/expense';

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { partner } = usePartner();
  const supabase = useMemo(() => createClient(), []);
  const filtersRef = useRef(filters);

  // Update ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Build query to fetch both user's expenses and partner's expenses (if partner exists)
      let query = supabase
        .from('expenses')
        .select('*')
        .is('deleted_at', null);

      // If partner exists, fetch expenses from both users
      // Otherwise, just fetch current user's expenses
      if (partner) {
        // Fetch expenses where user_id matches either user1 or user2 of the partner relationship
        query = query.or(`user_id.eq.${partner.user1_id},user_id.eq.${partner.user2_id}`);
      } else {
        // No partner - just fetch current user's expenses
        query = query.eq('user_id', user.id);
      }

      query = query
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      // Apply filters from ref to avoid dependency issues
      const currentFilters = filtersRef.current;
      if (currentFilters?.category_id) {
        query = query.eq('category_id', currentFilters.category_id);
      }

      if (currentFilters?.subcategory_id) {
        query = query.eq('subcategory_id', currentFilters.subcategory_id);
      }

      if (currentFilters?.start_date) {
        query = query.gte('date', currentFilters.start_date);
      }

      if (currentFilters?.end_date) {
        query = query.lte('date', currentFilters.end_date);
      }

      if (currentFilters?.user_id) {
        query = query.eq('user_id', currentFilters.user_id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [user, partner, supabase]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchExpenses();
  }, [user, fetchExpenses]);

  const addExpense = async (expenseData: ExpenseFormData): Promise<Expense | null> => {
    if (!user) return null;

    try {
      setError(null);

      // Set partner_id if expense is marked as shared and partner exists
      const partnerId = expenseData.is_shared && partner ? partner.id : null;

      const { data, error: insertError } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user.id,
          partner_id: partnerId,
          is_shared: expenseData.is_shared || false,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh expenses list
      await fetchExpenses();

      return data;
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to add expense');
      return null;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<ExpenseFormData>): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      // Set partner_id if expense is marked as shared and partner exists
      const partnerId = expenseData.is_shared && partner ? partner.id : null;

      const updatePayload: any = {
        ...expenseData,
        partner_id: expenseData.is_shared ? partnerId : null,
        is_shared: expenseData.is_shared || false,
      };

      const { error: updateError } = await supabase
        .from('expenses')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user owns the expense

      if (updateError) {
        throw updateError;
      }

      // Refresh expenses list
      await fetchExpenses();

      return true;
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      return false;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      // Soft delete by setting deleted_at timestamp
      const { error: deleteError } = await supabase
        .from('expenses')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user owns the expense

      if (deleteError) {
        throw deleteError;
      }

      // Refresh expenses list
      await fetchExpenses();

      return true;
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      return false;
    }
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

