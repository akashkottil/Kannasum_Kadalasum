'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExpenseTrend } from '@/lib/types/analytics';
import { formatCurrency } from '@/lib/utils/formatters';

interface BarChartProps {
  data: ExpenseTrend[];
  height?: number;
  showGrid?: boolean;
}

export function BarChartComponent({ data, height = 300, showGrid = true }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#6b7280' }}
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          tick={{ fill: '#6b7280' }}
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

