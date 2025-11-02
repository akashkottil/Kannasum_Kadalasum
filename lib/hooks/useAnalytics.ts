'use client';

import { useState, useEffect, useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useCategories } from './useCategories';
import { format, startOfMonth, endOfMonth, startOfDay, subMonths, eachDayOfInterval, parseISO } from 'date-fns';
import { CategoryDistribution, ExpenseTrend, UserComparison, MonthlyStats, SubcategoryDistribution, SpendingSummary } from '@/lib/types/analytics';
import { calculateTotal, calculateDailyAverage, groupByCategory, groupByDate } from '@/lib/utils/calculations';
import { useAuth } from '@/context/AuthContext';

export function useAnalytics(
  period: 'month' | 'week' | 'all' = 'month',
  expenseFilter: 'all' | 'shared' | 'individual' = 'all'
) {
  const { expenses, loading } = useExpenses();
  const { categories, subcategories } = useCategories();
  const { user } = useAuth();

  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    setAnalyticsLoading(loading);
  }, [loading]);

  const filteredExpenses = useMemo(() => {
    if (!expenses.length) return [];

    let filtered = expenses;

    // Filter by expense type (shared/individual)
    if (expenseFilter === 'shared') {
      filtered = filtered.filter(expense => expense.is_shared === true);
    } else if (expenseFilter === 'individual') {
      filtered = filtered.filter(expense => expense.is_shared === false || expense.is_shared === null);
    }
    // If expenseFilter === 'all', no filtering needed

    // Filter by time period
    const now = new Date();
    const startDate = period === 'month' 
      ? startOfMonth(now)
      : period === 'week'
      ? startOfDay(subMonths(now, 1))
      : null;

    if (!startDate) return filtered;

    return filtered.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= startDate;
    });
  }, [expenses, period, expenseFilter]);

  const monthlyStats: MonthlyStats = useMemo(() => {
    const total = calculateTotal(filteredExpenses);
    const averageDaily = calculateDailyAverage(filteredExpenses);
    const categorySet = new Set(filteredExpenses.map(e => e.category_id));

    return {
      total_spending: total,
      average_daily: averageDaily,
      category_count: categorySet.size,
      expense_count: filteredExpenses.length,
    };
  }, [filteredExpenses]);

  const categoryDistribution: CategoryDistribution[] = useMemo(() => {
    const grouped = groupByCategory(filteredExpenses);
    const total = calculateTotal(filteredExpenses);

    return Array.from(grouped.entries())
      .map(([category_id, amount]) => {
        const category = categories.find(c => c.id === category_id);
        return {
          category_id,
          category_name: category?.name || 'Unknown',
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
          icon: category?.icon || '💰',
          color: category?.color || '#999',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories]);

  const expenseTrends: ExpenseTrend[] = useMemo(() => {
    const grouped = groupByDate(filteredExpenses);
    
    if (period === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const days = eachDayOfInterval({ start: monthStart, end: now });

      return days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return {
          date: format(day, 'MMM dd'),
          amount: grouped.get(dateStr) || 0,
        };
      });
    } else {
      return Array.from(grouped.entries())
        .map(([date, amount]) => ({
          date: format(parseISO(date), 'MMM dd'),
          amount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
  }, [filteredExpenses, period]);

  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return expenses
      .filter(exp => {
        const expDate = parseISO(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calculate spending summary with splits
  const spendingSummary: SpendingSummary = useMemo(() => {
    let totalSpend = 0;
    let sharedSpend = 0;
    let individualSpend = 0;
    let yourShareOfShared = 0;
    let partnerShareOfShared = 0;

    const categoryMap = new Map<string, number>();
    const subcategoryMap = new Map<string, { amount: number; category_id: string }>();

    filteredExpenses.forEach(expense => {
      totalSpend += expense.amount;

      if (expense.is_shared) {
        sharedSpend += expense.amount;
        
        // Calculate your share and partner's share
        if (expense.user_id === user?.id) {
          // Expense added by current user
          if (expense.amount_paid_by_user !== null && expense.amount_paid_by_user !== undefined) {
            yourShareOfShared += expense.amount_paid_by_user;
          } else {
            // If not split, use full amount for user who added it
            yourShareOfShared += expense.amount;
          }
          if (expense.amount_paid_by_partner !== null && expense.amount_paid_by_partner !== undefined) {
            partnerShareOfShared += expense.amount_paid_by_partner;
          }
        } else {
          // Expense added by partner
          if (expense.amount_paid_by_partner !== null && expense.amount_paid_by_partner !== undefined) {
            yourShareOfShared += expense.amount_paid_by_partner;
          }
          if (expense.amount_paid_by_user !== null && expense.amount_paid_by_user !== undefined) {
            partnerShareOfShared += expense.amount_paid_by_user;
          } else {
            // If not split, use full amount for partner who added it
            partnerShareOfShared += expense.amount;
          }
        }
      } else {
        individualSpend += expense.amount;
      }

      // Category totals
      const catAmount = categoryMap.get(expense.category_id) || 0;
      categoryMap.set(expense.category_id, catAmount + expense.amount);

      // Subcategory totals
      if (expense.subcategory_id) {
        const subcatKey = expense.subcategory_id;
        const subcatData = subcategoryMap.get(subcatKey) || { amount: 0, category_id: expense.category_id };
        subcatData.amount += expense.amount;
        subcategoryMap.set(subcatKey, subcatData);
      }
    });

    // Build category distribution
    const categoryBreakdown: CategoryDistribution[] = Array.from(categoryMap.entries())
      .map(([category_id, amount]) => {
        const category = categories.find(c => c.id === category_id);
        return {
          category_id,
          category_name: category?.name || 'Unknown',
          amount,
          percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
          icon: category?.icon || '💰',
          color: category?.color || '#999',
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Build subcategory distribution
    const subcategoryBreakdown: SubcategoryDistribution[] = Array.from(subcategoryMap.entries())
      .map(([subcategory_id, data]) => {
        const subcategory = subcategories.find(sub => sub.id === subcategory_id);
        const category = categories.find(c => c.id === data.category_id);
        
        return {
          subcategory_id,
          subcategory_name: subcategory?.name || 'Unknown',
          category_id: data.category_id,
          category_name: category?.name || 'Unknown',
          amount: data.amount,
          percentage: totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0,
          icon: subcategory?.icon || '💰',
          color: subcategory?.color || '#999',
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      total_spend: totalSpend,
      shared_spend: sharedSpend,
      individual_spend: individualSpend,
      your_share_of_shared: yourShareOfShared,
      partner_share_of_shared: partnerShareOfShared,
      total_spend_by_category: categoryBreakdown,
      total_spend_by_subcategory: subcategoryBreakdown,
    };
  }, [filteredExpenses, categories, subcategories, user]);

  return {
    monthlyStats,
    categoryDistribution,
    expenseTrends,
    currentMonthTotal,
    spendingSummary,
    loading: analyticsLoading,
    totalExpenses: calculateTotal(expenses),
  };
}

