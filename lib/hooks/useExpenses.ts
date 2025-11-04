'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';
import { useCategories } from './useCategories';
import { usePaymentSources } from './usePaymentSources';
import { Expense, ExpenseFormData, ExpenseFilters } from '@/lib/types/expense';

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { partner } = usePartner();
  const { categories, subcategories } = useCategories();
  const { paymentSources } = usePaymentSources();
  const supabase = useMemo(() => createClient(), []);
  const filtersRef = useRef(filters);

  // Update ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Helper function to sync credit card balances from expenses
  const syncCreditCardBalances = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch all expenses for the user (including partner's if partner exists)
      let expenseQuery = supabase
        .from('expenses')
        .select('*')
        .is('deleted_at', null);

      if (partner) {
        expenseQuery = expenseQuery.or(`user_id.eq.${partner.user1_id},user_id.eq.${partner.user2_id}`);
      } else {
        expenseQuery = expenseQuery.eq('user_id', user.id);
      }

      const { data: allUserExpenses, error: expenseError } = await expenseQuery;
      if (expenseError) throw expenseError;

      // Fetch credit cards for the user
      const { data: userCreditCards, error: cardError } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', user.id);

      if (cardError) throw cardError;
      if (!userCreditCards || userCreditCards.length === 0) return;

      // Get payment sources to map credit card names
      const { data: paymentSourcesData } = await supabase
        .from('payment_sources')
        .select('*')
        .eq('type', 'credit_card');

      // Get categories to identify Credit Card Repayment category
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');

      // Get subcategories to map repayment subcategory to card name
      const { data: subcategoriesData } = await supabase
        .from('subcategories')
        .select('*');

      const ccRepaymentCategory = categoriesData?.find(cat => cat.name === 'Credit Card Repayment');
      const paymentSourceMap = new Map(paymentSourcesData?.map(ps => [ps.name, ps.id]) || []);
      const subcategoryMap = new Map(subcategoriesData?.map(sub => [sub.id, sub.name]) || []);

      // Calculate balance for each credit card
      for (const card of userCreditCards) {
        let balance = 0;

        // Find payment source ID for this card
        const paymentSourceId = paymentSourceMap.get(card.card_name);

        allUserExpenses?.forEach(expense => {
          // If expense uses this credit card as payment source, increase balance
          if (expense.payment_source_id === paymentSourceId) {
            balance += expense.amount;
          }

          // If expense is Credit Card Repayment for this card, decrease balance
          if (expense.category_id === ccRepaymentCategory?.id && expense.subcategory_id) {
            const subcategoryName = subcategoryMap.get(expense.subcategory_id);
            if (subcategoryName === card.card_name) {
              balance -= expense.amount;
            }
          }
        });

        // Update credit card balance
        await supabase
          .from('credit_cards')
          .update({ current_balance: Math.max(0, balance) })
          .eq('id', card.id);
      }
    } catch (err) {
      console.error('Error syncing credit card balances:', err);
    }
  }, [user, partner, supabase]);

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

      if (currentFilters?.payment_source_id) {
        query = query.eq('payment_source_id', currentFilters.payment_source_id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setAllExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [user, partner, supabase]);

  // Apply client-side search, filter, and sort
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...allExpenses];
    const currentFilters = filters || filtersRef.current;

    // Apply search query
    if (currentFilters?.search_query && currentFilters.search_query.trim()) {
      const searchLower = currentFilters.search_query.toLowerCase().trim();
      const categoryMap = new Map(categories.map(cat => [cat.id, cat.name.toLowerCase()]));
      const subcategoryMap = new Map(subcategories.map(sub => [sub.id, sub.name.toLowerCase()]));
      const paymentSourceMap = new Map(paymentSources.map(ps => [ps.id, ps.name.toLowerCase()]));

      result = result.filter(expense => {
        const categoryName = categoryMap.get(expense.category_id) || '';
        const subcategoryName = expense.subcategory_id ? (subcategoryMap.get(expense.subcategory_id) || '') : '';
        const paymentSourceName = expense.payment_source_id ? (paymentSourceMap.get(expense.payment_source_id) || '') : '';
        const notes = (expense.notes || '').toLowerCase();

        return categoryName.includes(searchLower) ||
               subcategoryName.includes(searchLower) ||
               paymentSourceName.includes(searchLower) ||
               notes.includes(searchLower);
      });
    }

    // Apply sorting
    if (currentFilters?.sort_by) {
      const sortBy = currentFilters.sort_by;
      const sortOrder = currentFilters.sort_order || 'desc';

      result.sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'date') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          comparison = dateA - dateB;
        } else if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortBy === 'category') {
          const categoryA = categories.find(c => c.id === a.category_id)?.name || '';
          const categoryB = categories.find(c => c.id === b.category_id)?.name || '';
          comparison = categoryA.localeCompare(categoryB);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else {
      // Default sort by date descending
      result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [allExpenses, categories, subcategories, paymentSources, filters]);

  useEffect(() => {
    setExpenses(filteredAndSortedExpenses);
  }, [filteredAndSortedExpenses]);

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
          amount_paid_by_user: expenseData.is_shared && expenseData.amount_paid_by_user !== undefined 
            ? expenseData.amount_paid_by_user 
            : null,
          amount_paid_by_partner: expenseData.is_shared && expenseData.amount_paid_by_partner !== undefined 
            ? expenseData.amount_paid_by_partner 
            : null,
          payment_source_id: expenseData.payment_source_id || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh expenses list
      await fetchExpenses();

      // Sync credit card balances
      await syncCreditCardBalances();

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
        amount_paid_by_user: expenseData.is_shared && expenseData.amount_paid_by_user !== undefined 
          ? expenseData.amount_paid_by_user 
          : null,
        amount_paid_by_partner: expenseData.is_shared && expenseData.amount_paid_by_partner !== undefined 
          ? expenseData.amount_paid_by_partner 
          : null,
        payment_source_id: expenseData.payment_source_id !== undefined ? expenseData.payment_source_id : null,
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

      // Sync credit card balances
      await syncCreditCardBalances();

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

      // Sync credit card balances
      await syncCreditCardBalances();

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

