export interface PaymentSource {
  id: string;
  name: string;
  type: 'credit_card' | 'savings_account';
  icon: string | null;
  created_at: string;
  updated_at: string;
}

