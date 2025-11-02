'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData } from '@/lib/types/expense';
import { useCategories } from '@/lib/hooks/useCategories';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';
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
  const { user } = useAuth();
  const { partner } = usePartner();
  const [partnerUser, setPartnerUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: expense?.amount || 0,
    category_id: expense?.category_id || '',
    subcategory_id: expense?.subcategory_id || null,
    date: expense?.date || new Date().toISOString().split('T')[0],
    time: expense?.time || null,
    notes: expense?.notes || undefined,
    custom_icon: expense?.custom_icon || undefined,
    paid_by_user_id: expense?.paid_by_user_id || null,
    is_shared: expense?.is_shared || false,
  });

  // Determine partner's user ID
  useEffect(() => {
    if (!partner || !user) {
      setPartnerUser(null);
      return;
    }

    const partnerUserId = partner.user1_id === user.id ? partner.user2_id : partner.user1_id;
    setPartnerUser({
      id: partnerUserId,
      email: '',
      name: 'Partner',
    });
  }, [partner, user]);

  // Get current user's name from user metadata
  const currentUserName = user?.user_metadata?.full_name || user?.email || 'You';
  const partnerUserName = 'Partner';

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

          {/* Who Paid Dropdown - Only show if partner exists */}
          {partner && user && (
            <div className="space-y-2">
              <Label htmlFor="paid_by_user_id">Who Paid (Optional)</Label>
              <Select
                id="paid_by_user_id"
                value={formData.paid_by_user_id || ''}
                onChange={(e) => handleChange('paid_by_user_id', e.target.value || null)}
                disabled={loading}
              >
                <option value="">Not specified</option>
                <option value={user.id}>{currentUserName}</option>
                <option value={partnerUser?.id || ''}>{partnerUserName}</option>
              </Select>
            </div>
          )}

          {/* Mark as Shared Expense - Only show if partner exists */}
          {partner ? (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_shared"
                checked={formData.is_shared || false}
                onChange={(e) => handleChange('is_shared', e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="is_shared" className="cursor-pointer">
                Mark as shared expense
              </Label>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> To mark expenses as shared, you need to link with a partner first. 
                Go to <a href="/settings" className="underline text-blue-600 dark:text-blue-400">Settings</a> to send an invitation.
              </p>
            </div>
          )}

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

