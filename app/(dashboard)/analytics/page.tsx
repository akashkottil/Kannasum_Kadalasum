'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { PieChartComponent } from '@/components/charts/PieChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'month' | 'week' | 'all'>('month');
  const { categoryDistribution, expenseTrends, monthlyStats, loading } = useAnalytics(period);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights into your spending patterns
          </p>
        </div>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'month' | 'week' | 'all')}
          className="w-32"
        >
          <option value="month">Monthly</option>
          <option value="week">Weekly</option>
          <option value="all">All Time</option>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <PieChartComponent data={categoryDistribution} height={300} />
            )}
          </CardContent>
        </Card>

        {/* Spending Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <LineChartComponent data={expenseTrends} height={300} />
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Daily Expenses */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <BarChartComponent data={expenseTrends} height={350} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
