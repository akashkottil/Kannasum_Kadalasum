export interface CategoryDistribution {
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ExpenseTrend {
  date: string;
  amount: number;
}

export interface UserComparison {
  user_id: string;
  user_name: string;
  total_amount: number;
  percentage: number;
}

export interface MonthlyStats {
  total_spending: number;
  average_daily: number;
  category_count: number;
  expense_count: number;
}

export interface AnalyticsFilters {
  start_date: string;
  end_date: string;
  category_id?: string;
  period: 'day' | 'week' | 'month' | 'custom';
}

export interface SubcategoryDistribution {
  subcategory_id: string;
  subcategory_name: string;
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface SpendingSummary {
  total_spend: number;
  shared_spend: number;
  individual_spend: number;
  your_share_of_shared: number;
  partner_share_of_shared: number;
  total_spend_by_category: CategoryDistribution[];
  total_spend_by_subcategory: SubcategoryDistribution[];
}

