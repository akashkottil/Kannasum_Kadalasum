-- Add payment_source_id column to expenses table
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS payment_source_id UUID REFERENCES payment_sources(id) ON DELETE SET NULL;

-- Create index for payment_source_id
CREATE INDEX IF NOT EXISTS idx_expenses_payment_source_id ON expenses(payment_source_id);

