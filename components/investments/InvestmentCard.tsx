'use client';

import { Investment } from '@/lib/types/investment';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface InvestmentCardProps {
  investment: Investment;
  investmentTypeName?: string;
  investmentTypeIcon?: string;
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
}

export function InvestmentCard({ investment, investmentTypeName, investmentTypeIcon, onEdit, onDelete }: InvestmentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{investmentTypeIcon || '💰'}</span>
              <span className={`text-lg font-semibold ${investment.transaction_type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {investment.transaction_type === 'deposit' ? '+' : '-'}{formatCurrency(investment.amount)}
              </span>
              {investment.transaction_type === 'deposit' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {investmentTypeName && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Type:</span>
                  <span>{investmentTypeName}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-medium">Date:</span>
                <span>{formatDate(investment.date)}</span>
              </div>
              {investment.maturity_date && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Maturity Date:</span>
                  <span>{formatDate(investment.maturity_date)}</span>
                </div>
              )}
              {investment.interest_rate && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Interest Rate:</span>
                  <span>{investment.interest_rate}%</span>
                </div>
              )}
              {investment.notes && (
                <div className="mt-2 text-gray-700 dark:text-gray-300 italic">
                  "{investment.notes}"
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(investment)}
              aria-label="Edit investment"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(investment.id)}
              aria-label="Delete investment"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

