-- Add paid_by_user_id column to expenses table
ALTER TABLE expenses 
ADD COLUMN paid_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by_user_id ON expenses(paid_by_user_id);

-- Add comment for documentation
COMMENT ON COLUMN expenses.paid_by_user_id IS 'User ID of the person who paid for this expense';

