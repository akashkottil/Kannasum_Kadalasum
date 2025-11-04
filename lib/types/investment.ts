export interface InvestmentType {
  id: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  investment_type_id: string;
  amount: number;
  date: string;
  transaction_type: 'deposit' | 'withdrawal';
  notes: string | null;
  maturity_date: string | null;
  interest_rate: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InvestmentFormData {
  investment_type_id: string;
  amount: number;
  date: string;
  transaction_type: 'deposit' | 'withdrawal';
  notes?: string;
  maturity_date?: string;
  interest_rate?: number;
}

export interface InvestmentFilters {
  investment_type_id?: string;
  transaction_type?: 'deposit' | 'withdrawal';
  start_date?: string;
  end_date?: string;
}

