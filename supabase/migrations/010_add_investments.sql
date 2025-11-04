-- Create investment_types table
CREATE TABLE IF NOT EXISTS investment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_type_id UUID NOT NULL REFERENCES investment_types(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  notes TEXT,
  maturity_date DATE,
  interest_rate DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_investment_type_id ON investments(investment_type_id);
CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(date);
CREATE INDEX IF NOT EXISTS idx_investments_user_date ON investments(user_id, date);

-- Create trigger for updated_at
CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for investment_types updated_at
CREATE TRIGGER update_investment_types_updated_at
  BEFORE UPDATE ON investment_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE investment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Investment types policies (read-only for all authenticated users)
CREATE POLICY "Users can view all investment types"
  ON investment_types FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Investments policies
CREATE POLICY "Users can view their own investments"
  ON investments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create investments"
  ON investments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own investments"
  ON investments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own investments"
  ON investments FOR DELETE
  USING (user_id = auth.uid());

