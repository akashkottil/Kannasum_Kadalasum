'use client';

import { useState, useEffect, useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useCategories } from './useCategories';
import { format, startOfMonth, endOfMonth, startOfDay, subMonths, eachDayOfInterval, parseISO } from 'date-fns';
import { CategoryDistribution, ExpenseTrend, UserComparison, MonthlyStats } from '@/lib/types/analytics';
import { calculateTotal, calculateDailyAverage, groupByCategory, groupByDate } from '@/lib/utils/calculations';

export function useAnalytics(
  period: 'month' | 'week' | 'all' = 'month',
  expenseFilter: 'all' | 'shared' | 'individual' = 'all'
) {
  const { expenses, loading } = useExpenses();
  const { categories } = useCategories();

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

  return {
    monthlyStats,
    categoryDistribution,
    expenseTrends,
    currentMonthTotal,
    loading: analyticsLoading,
    totalExpenses: calculateTotal(expenses),
  };
}

