export interface Expense {
  id: string;
  user_id: string;
  partner_id: string | null;
  amount: number;
  category_id: string;
  subcategory_id: string | null;
  date: string;
  time: string | null;
  notes: string | null;
  custom_icon: string | null;
  paid_by_user_id: string | null;
  is_shared: boolean;
  amount_paid_by_user: number | null;
  amount_paid_by_partner: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ExpenseFormData {
  amount: number;
  category_id: string;
  subcategory_id: string | null;
  date: string;
  time: string | null;
  notes?: string;
  custom_icon?: string;
  paid_by_user_id?: string | null;
  is_shared?: boolean;
  amount_paid_by_user?: number | null;
  amount_paid_by_partner?: number | null;
}

export interface ExpenseFilters {
  category_id?: string;
  subcategory_id?: string;
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

