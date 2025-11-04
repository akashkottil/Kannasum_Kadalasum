'use client';

import { useState, useMemo } from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useCategories } from '@/lib/hooks/useCategories';
import { usePaymentSources } from '@/lib/hooks/usePaymentSources';
import { Expense } from '@/lib/types/expense';
import { ExpenseCard } from './ExpenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Filter, X, Search } from 'lucide-react';

interface ExpenseListProps {
  onAddNew: () => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ onAddNew, onEdit }: ExpenseListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('');
  const [paymentSourceFilter, setPaymentSourceFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filters = useMemo(() => ({
    category_id: categoryFilter || undefined,
    subcategory_id: subcategoryFilter || undefined,
    payment_source_id: paymentSourceFilter || undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
    search_query: searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  }), [categoryFilter, subcategoryFilter, paymentSourceFilter, startDateFilter, endDateFilter, searchQuery, sortBy, sortOrder]);

  const { expenses, loading, deleteExpense } = useExpenses(filters);
  const { categories, subcategories } = useCategories();
  const { paymentSources } = usePaymentSources();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setSubcategoryFilter('');
    setPaymentSourceFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
  };

  const hasActiveFilters = categoryFilter || subcategoryFilter || paymentSourceFilter || startDateFilter || endDateFilter || searchQuery;

  // Get subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    if (!categoryFilter) return [];
    return subcategories.filter(sub => sub.category_id === categoryFilter);
  }, [categoryFilter, subcategories]);

  // Create lookup maps for category, subcategory, and payment source names
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const subcategoryMap = new Map(subcategories.map(sub => [sub.id, sub.name]));
  const paymentSourceMap = new Map(paymentSources.map(ps => [ps.id, ps.name]));

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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by category, subcategory, payment source, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by" className="text-sm font-medium">
          Sort by:
        </label>
        <Select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
          className="w-32"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="w-28"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label htmlFor="filter-category" className="text-sm font-medium">
                Category
              </label>
              <Select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubcategoryFilter(''); // Clear subcategory when category changes
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </Select>
            </div>

            {availableSubcategories.length > 0 && (
              <div className="space-y-2">
                <label htmlFor="filter-subcategory" className="text-sm font-medium">
                  Subcategory
                </label>
                <Select
                  id="filter-subcategory"
                  value={subcategoryFilter}
                  onChange={(e) => setSubcategoryFilter(e.target.value)}
                >
                  <option value="">All Subcategories</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.icon} {subcategory.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="filter-payment-source" className="text-sm font-medium">
                Payment Source
              </label>
              <Select
                id="filter-payment-source"
                value={paymentSourceFilter}
                onChange={(e) => setPaymentSourceFilter(e.target.value)}
              >
                <option value="">All Payment Sources</option>
                {paymentSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.icon} {source.name}
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
              paymentSourceName={expense.payment_source_id ? paymentSourceMap.get(expense.payment_source_id) : undefined}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

