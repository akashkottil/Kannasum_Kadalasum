'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/lib/types/expense';
import { useCategories } from '@/lib/hooks/useCategories';
import { validateExpense } from '@/lib/utils/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ExpenseForm({ expense, onSubmit, onCancel, loading }: ExpenseFormProps) {
  const { categories, subcategories } = useCategories();

  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: expense?.amount || 0,
    category_id: expense?.category_id || '',
    subcategory_id: expense?.subcategory_id || null,
    date: expense?.date || new Date().toISOString().split('T')[0],
    time: expense?.time || null,
    notes: expense?.notes || undefined,
    custom_icon: expense?.custom_icon || undefined,
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Get subcategories for the selected category
  const availableSubcategories = subcategories.filter(
    sub => sub.category_id === formData.category_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate form data
    const validationErrors = validateExpense(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => {
                handleChange('category_id', e.target.value);
                // Clear subcategory when category changes
                handleChange('subcategory_id', null);
              }}
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </Select>
          </div>

          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategory_id">Subcategory (Optional)</Label>
              <Select
                id="subcategory_id"
                value={formData.subcategory_id || ''}
                onChange={(e) => handleChange('subcategory_id', e.target.value || null)}
                disabled={loading}
              >
                <option value="">None</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.icon} {subcategory.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time (Optional)</Label>
              <Input
                id="time"
                type="time"
                value={formData.time || ''}
                onChange={(e) => handleChange('time', e.target.value || null)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              type="text"
              placeholder="Add any notes..."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value || undefined)}
              disabled={loading}
            />
          </div>

          {errors.length > 0 && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : expense ? 'Update' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

