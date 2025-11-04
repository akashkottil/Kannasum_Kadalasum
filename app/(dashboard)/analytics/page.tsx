'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { usePaymentSources } from '@/lib/hooks/usePaymentSources';
import { PieChartComponent } from '@/components/charts/PieChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

import { formatCurrency } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Users, User, ShoppingBag, CreditCard } from 'lucide-react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'month' | 'week' | 'all'>('month');
  const [expenseFilter, setExpenseFilter] = useState<'all' | 'shared' | 'individual'>('all');
  const [paymentSourceFilter, setPaymentSourceFilter] = useState<string>('');
  const { paymentSources } = usePaymentSources();
  const { categoryDistribution, expenseTrends, monthlyStats, spendingSummary, loading } = useAnalytics(period, expenseFilter, paymentSourceFilter || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights into your spending patterns
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={expenseFilter}
            onChange={(e) => setExpenseFilter(e.target.value as 'all' | 'shared' | 'individual')}
            className="w-40"
          >
            <option value="all">All Expenses</option>
            <option value="shared">Shared Only</option>
            <option value="individual">Individual Only</option>
          </Select>
          <Select
            value={paymentSourceFilter}
            onChange={(e) => setPaymentSourceFilter(e.target.value)}
            className="w-48"
          >
            <option value="">All Payment Sources</option>
            {paymentSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.icon} {source.name}
              </option>
            ))}
          </Select>
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
      </div>

      {/* Spending Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spend</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(spendingSummary?.total_spend || 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Shared Spend</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(spendingSummary?.shared_spend || 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Share</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(spendingSummary?.your_share_of_shared || 0)}</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Individual Spend</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(spendingSummary?.individual_spend || 0)}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
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

      {/* Category Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : spendingSummary?.total_spend_by_category && spendingSummary.total_spend_by_category.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {spendingSummary.total_spend_by_category.map((item) => (
                    <tr key={item.category_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium">{item.category_name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.amount)}</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subcategory Breakdown Table */}
      {spendingSummary?.total_spend_by_subcategory && spendingSummary.total_spend_by_subcategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Subcategory</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Subcategory</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendingSummary.total_spend_by_subcategory.map((item) => (
                      <tr key={item.subcategory_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.category_name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.subcategory_name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.amount)}</td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                              {item.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Source Analysis */}
      {spendingSummary?.total_spend_by_payment_source && spendingSummary.total_spend_by_payment_source.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Spending by Payment Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : (
                <PieChartComponent 
                  data={spendingSummary.total_spend_by_payment_source.map(item => ({
                    name: item.payment_source_name,
                    value: item.amount,
                    icon: item.icon || '💰',
                  }))} 
                  height={300} 
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Payment Source</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spendingSummary.total_spend_by_payment_source.map((item) => (
                        <tr key={item.payment_source_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.icon || '💰'}</span>
                              <span className="font-medium">{item.payment_source_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm capitalize">{item.type.replace('_', ' ')}</span>
                          </td>
                          <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.amount)}</td>
                          <td className="text-right py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                {item.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Credit Card Spending Analytics */}
      {spendingSummary?.credit_card_spending && spendingSummary.credit_card_spending.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Credit Card Spending Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : (
                <div className="space-y-6">
                  {spendingSummary.credit_card_spending.map((cardData) => (
                    <div key={cardData.card_name} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">{cardData.card_name}</h4>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Spend</div>
                          <div className="text-xl font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(cardData.total_spend)}
                          </div>
                        </div>
                      </div>
                      
                      {cardData.category_breakdown.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Spending by Category:
                          </div>
                          <div className="space-y-2">
                            {cardData.category_breakdown.map((cat, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{cat.category_name}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-20 text-right">
                                    {formatCurrency(cat.amount)}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                                    {cat.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          No category breakdown available
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Card Spending Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Credit Card</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Total Spend</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spendingSummary.credit_card_spending.map((cardData) => {
                        const totalCCSpend = spendingSummary.credit_card_spending.reduce((sum, c) => sum + c.total_spend, 0);
                        const percentage = totalCCSpend > 0 ? (cardData.total_spend / totalCCSpend) * 100 : 0;
                        return (
                          <tr key={cardData.card_name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">💳</span>
                                <span className="font-medium">{cardData.card_name}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(cardData.total_spend)}
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
