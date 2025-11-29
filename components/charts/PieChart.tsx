'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryDistribution } from '@/lib/types/analytics';
import { formatCurrency } from '@/lib/utils/formatters';

interface PieChartProps {
  data: CategoryDistribution[];
  height?: number;
}

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316', '#6366F1'];

export function PieChartComponent({ data, height = 300 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  // Transform data to match Recharts expected format
  interface ChartDataItem {
    name: string;
    value: number;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
    category_id: string;
    [key: string]: string | number;
  }
  
  const chartData: ChartDataItem[] = data.map((item): ChartDataItem => ({
    name: item.category_name,
    value: item.amount,
    amount: item.amount,
    percentage: item.percentage,
    color: item.color,
    icon: item.icon,
    category_id: item.category_id,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: { name?: string; percent?: number }) => {
            const { name, percent } = props;
            return `${name || ''}: ${((percent || 0) * 100).toFixed(0)}%`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

