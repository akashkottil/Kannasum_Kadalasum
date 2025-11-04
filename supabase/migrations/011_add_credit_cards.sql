-- Create credit_cards table
CREATE TABLE IF NOT EXISTS credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_number_last4 TEXT,
  credit_limit DECIMAL(10, 2),
  current_balance DECIMAL(10, 2) DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, card_name)
);

-- Create credit_card_repayments table
CREATE TABLE IF NOT EXISTS credit_card_repayments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON credit_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_card_repayments_user_id ON credit_card_repayments(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_card_repayments_credit_card_id ON credit_card_repayments(credit_card_id);
CREATE INDEX IF NOT EXISTS idx_credit_card_repayments_payment_date ON credit_card_repayments(payment_date);

-- Create triggers for updated_at
CREATE TRIGGER update_credit_cards_updated_at
  BEFORE UPDATE ON credit_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_card_repayments_updated_at
  BEFORE UPDATE ON credit_card_repayments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_repayments ENABLE ROW LEVEL SECURITY;

-- Credit cards policies
CREATE POLICY "Users can view their own credit cards"
  ON credit_cards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create credit cards"
  ON credit_cards FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own credit cards"
  ON credit_cards FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own credit cards"
  ON credit_cards FOR DELETE
  USING (user_id = auth.uid());

-- Credit card repayments policies
CREATE POLICY "Users can view their own credit card repayments"
  ON credit_card_repayments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create credit card repayments"
  ON credit_card_repayments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own credit card repayments"
  ON credit_card_repayments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own credit card repayments"
  ON credit_card_repayments FOR DELETE
  USING (user_id = auth.uid());

