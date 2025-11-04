'use client';

import { useState } from 'react';
import { Investment, InvestmentFormData } from '@/lib/types/investment';
import { InvestmentForm } from '@/components/investments/InvestmentForm';
import { InvestmentList } from '@/components/investments/InvestmentList';
import { useInvestments } from '@/lib/hooks/useInvestments';

export default function InvestmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();
  const { addInvestment, updateInvestment } = useInvestments();
  const [formLoading, setFormLoading] = useState(false);

  const handleAddNew = () => {
    setEditingInvestment(undefined);
    setShowForm(true);
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleSubmit = async (formData: InvestmentFormData) => {
    setFormLoading(true);
    
    try {
      if (editingInvestment) {
        const success = await updateInvestment(editingInvestment.id, formData);
        if (success) {
          setShowForm(false);
          setEditingInvestment(undefined);
        }
      } else {
        await addInvestment(formData);
        setShowForm(false);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInvestment(undefined);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <InvestmentList onAddNew={handleAddNew} onEdit={handleEdit} />
      ) : (
        <InvestmentForm
          investment={editingInvestment}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
}

