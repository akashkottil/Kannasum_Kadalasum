'use client';

import { Expense } from '@/lib/types/expense';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  categoryName?: string;
  subcategoryName?: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, categoryName, subcategoryName, onEdit, onDelete }: ExpenseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{expense.custom_icon || '💰'}</span>
              <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
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
              {expense.notes && (
                <div className="mt-2 text-gray-700 dark:text-gray-300 italic">
                  "{expense.notes}"
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

