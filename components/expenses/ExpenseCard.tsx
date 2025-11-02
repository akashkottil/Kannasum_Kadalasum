'use client';

import { Expense } from '@/lib/types/expense';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePartner } from '@/context/PartnerContext';

interface ExpenseCardProps {
  expense: Expense;
  categoryName?: string;
  subcategoryName?: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, categoryName, subcategoryName, onEdit, onDelete }: ExpenseCardProps) {
  const { user } = useAuth();
  const { partner } = usePartner();

  // Determine who paid
  const getPaidByName = () => {
    if (!expense.paid_by_user_id) return null;
    if (expense.paid_by_user_id === user?.id) {
      return user?.user_metadata?.full_name || user?.email || 'You';
    }
    // Otherwise it's the partner
    return 'Partner';
  };

  // Determine expense owner
  const getExpenseOwner = () => {
    if (expense.user_id === user?.id) {
      return user?.user_metadata?.full_name || user?.email || 'You';
    }
    return 'Partner';
  };

  const paidByName = getPaidByName();
  const expenseOwner = getExpenseOwner();
  const isOwnExpense = expense.user_id === user?.id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{expense.custom_icon || '💰'}</span>
              <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
              {expense.is_shared && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  <Users className="h-3 w-3" />
                  Shared
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {categoryName && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Category:</span>
                  <span>{categoryName}</span>
                </div>
              )}
              {subcategoryName && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Subcategory:</span>
                  <span>{subcategoryName}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-medium">Date:</span>
                <span>{formatDateTime(expense.date, expense.time)}</span>
              </div>
              {partner && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Added by:</span>
                  <span>{expenseOwner}</span>
                </div>
              )}
              {paidByName && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Paid by:</span>
                  <span>{paidByName}</span>
                </div>
              )}
              {expense.notes && (
                <div className="mt-2 text-gray-700 dark:text-gray-300 italic">
                  "{expense.notes}"
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            {/* Only show edit/delete for expenses owned by current user */}
            {isOwnExpense && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(expense)}
                  aria-label="Edit expense"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(expense.id)}
                  aria-label="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

