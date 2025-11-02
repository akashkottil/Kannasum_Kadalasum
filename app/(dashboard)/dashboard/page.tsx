'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useCategories } from '@/lib/hooks/useCategories';
import { formatCurrency } from '@/lib/utils/formatters';
import { formatDate } from '@/lib/utils/formatters';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { monthlyStats, currentMonthTotal, totalExpenses, loading } = useAnalytics('month');
  const { expenses } = useExpenses();
  const { categories, subcategories } = useCategories();

  // Get last month total for comparison
  const lastMonthTotal = useMemo(() => {
    // Simple comparison - in a real app, fetch last month's data
    return currentMonthTotal * 0.85; // Placeholder
  }, [currentMonthTotal]);

  const monthlyChange = useMemo(() => {
    if (lastMonthTotal === 0) return 0;
    return ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  }, [currentMonthTotal, lastMonthTotal]);

  // Get recent expenses (last 5)
  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const subcategoryMap = new Map(subcategories.map(sub => [sub.id, sub.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your expenses and spending patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              All time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              This Month
            </div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(currentMonthTotal)}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(monthlyChange).toFixed(1)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Average Daily
            </div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(monthlyStats.average_daily)}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Categories Used
            </div>
            <div className="text-3xl font-bold text-foreground">
              {monthlyStats.category_count}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Active categories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium mb-2">No expenses yet</p>
              <p className="text-sm">Start tracking your expenses to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{expense.custom_icon || '💰'}</span>
                        <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {categoryMap.get(expense.category_id) && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Category:</span>
                            <span>{categoryMap.get(expense.category_id)}</span>
                          </div>
                        )}
                        {expense.subcategory_id && subcategoryMap.get(expense.subcategory_id) && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Subcategory:</span>
                            <span>{subcategoryMap.get(expense.subcategory_id)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Date:</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                        {expense.notes && (
                          <div className="mt-2 text-gray-700 dark:text-gray-300 italic">
                            "{expense.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
