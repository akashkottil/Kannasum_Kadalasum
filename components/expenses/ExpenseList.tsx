'use client';

import { useState, useMemo } from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useCategories } from '@/lib/hooks/useCategories';
import { Expense } from '@/lib/types/expense';
import { ExpenseCard } from './ExpenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Filter, X } from 'lucide-react';

interface ExpenseListProps {
  onAddNew: () => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ onAddNew, onEdit }: ExpenseListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  const filters = useMemo(() => ({
    category_id: categoryFilter || undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
  }), [categoryFilter, startDateFilter, endDateFilter]);

  const { expenses, loading, deleteExpense } = useExpenses(filters);
  const { categories, subcategories } = useCategories();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const hasActiveFilters = categoryFilter || startDateFilter || endDateFilter;

  // Create lookup maps for category and subcategory names
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const subcategoryMap = new Map(subcategories.map(sub => [sub.id, sub.name]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filter Expenses</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label htmlFor="filter-category" className="text-sm font-medium">
                Category
              </label>
              <Select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="filter-start-date" className="text-sm font-medium">
                Start Date
              </label>
              <Input
                id="filter-start-date"
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="filter-end-date" className="text-sm font-medium">
                End Date
              </label>
              <Input
                id="filter-end-date"
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading expenses...
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No expenses found</p>
          <p className="text-sm mb-4">
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Start tracking your expenses by adding your first one'}
          </p>
          {!hasActiveFilters && (
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Expense
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              categoryName={categoryMap.get(expense.category_id)}
              subcategoryName={expense.subcategory_id ? subcategoryMap.get(expense.subcategory_id) : undefined}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

