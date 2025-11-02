-- Add is_shared boolean column to expenses table
ALTER TABLE expenses 
ADD COLUMN is_shared BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_is_shared ON expenses(is_shared);

-- Add comment for documentation
COMMENT ON COLUMN expenses.is_shared IS 'Whether this expense is marked as shared with partner';

