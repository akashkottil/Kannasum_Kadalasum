import { Expense } from '@/lib/types/expense';

export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function calculateAverage(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  return calculateTotal(expenses) / expenses.length;
}

export function calculateDailyAverage(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  const dateSet = new Set(expenses.map(e => e.date));
  const uniqueDays = dateSet.size;
  if (uniqueDays === 0) return 0;
  return calculateTotal(expenses) / uniqueDays;
}

export function groupByCategory(expenses: Expense[]): Map<string, number> {
  const grouped = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = grouped.get(expense.category_id) || 0;
    grouped.set(expense.category_id, current + expense.amount);
  });

  return grouped;
}

export function groupByUser(expenses: Expense[]): Map<string, number> {
  const grouped = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = grouped.get(expense.user_id) || 0;
    grouped.set(expense.user_id, current + expense.amount);
  });

  return grouped;
}

export function groupByDate(expenses: Expense[]): Map<string, number> {
  const grouped = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = grouped.get(expense.date) || 0;
    grouped.set(expense.date, current + expense.amount);
  });

  return grouped;
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function getTopCategories(
  expenses: Expense[],
  limit: number = 5
): Array<{ category_id: string; amount: number }> {
  const grouped = groupByCategory(expenses);
  const sorted = Array.from(grouped.entries())
    .map(([category_id, amount]) => ({ category_id, amount }))
    .sort((a, b) => b.amount - a.amount);

  return sorted.slice(0, limit);
}

