-- Create payment_sources table
CREATE TABLE IF NOT EXISTS payment_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'savings_account')),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trigger for updated_at
CREATE TRIGGER update_payment_sources_updated_at
  BEFORE UPDATE ON payment_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (read-only for all authenticated users)
ALTER TABLE payment_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all payment sources"
  ON payment_sources FOR SELECT
  USING (auth.uid() IS NOT NULL);

