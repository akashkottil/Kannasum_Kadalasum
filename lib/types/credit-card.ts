export interface CreditCard {
  id: string;
  user_id: string;
  card_name: string;
  card_number_last4: string | null;
  credit_limit: number | null;
  current_balance: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCardRepayment {
  id: string;
  user_id: string;
  credit_card_id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCardRepaymentFormData {
  credit_card_id: string;
  amount: number;
  payment_date: string;
  notes?: string;
}

export interface CreditCardFormData {
  card_name: string;
  card_number_last4?: string;
  credit_limit?: number;
  current_balance?: number;
  due_date?: string;
}

