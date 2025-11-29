'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/lib/types/expense';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useExpenses } from '@/lib/hooks/useExpenses';

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const { addExpense, updateExpense } = useExpenses();
  const [formLoading, setFormLoading] = useState(false);

  const handleAddNew = () => {
    setEditingExpense(undefined);
    setShowForm(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleSubmit = async (formData: ExpenseFormData) => {
    setFormLoading(true);
    
    try {
      if (editingExpense) {
        const success = await updateExpense(editingExpense.id, formData);
        if (success) {
          setShowForm(false);
          setEditingExpense(undefined);
        }
      } else {
        await addExpense(formData);
        setShowForm(false);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <ExpenseList onAddNew={handleAddNew} onEdit={handleEdit} />
      ) : (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
}
