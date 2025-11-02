-- Add fields for splitting shared expenses
-- This allows tracking how much each person paid for a shared expense

ALTER TABLE expenses 
ADD COLUMN amount_paid_by_user DECIMAL(10, 2) CHECK (amount_paid_by_user >= 0),
ADD COLUMN amount_paid_by_partner DECIMAL(10, 2) CHECK (amount_paid_by_partner >= 0);

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_expenses_is_shared ON expenses(is_shared);

-- Add comment for documentation
COMMENT ON COLUMN expenses.amount_paid_by_user IS 'Amount paid by the expense owner (user) for shared expenses';
COMMENT ON COLUMN expenses.amount_paid_by_partner IS 'Amount paid by the partner for shared expenses';

-- Add check constraint to ensure split amounts sum to total for shared expenses
-- Note: This allows NULL values for non-shared expenses
ALTER TABLE expenses 
ADD CONSTRAINT check_split_amounts 
CHECK (
  (is_shared = false) OR 
  (is_shared = true AND (
    (amount_paid_by_user IS NULL AND amount_paid_by_partner IS NULL) OR
    (amount_paid_by_user IS NOT NULL AND amount_paid_by_partner IS NOT NULL AND 
     ABS((COALESCE(amount_paid_by_user, 0) + COALESCE(amount_paid_by_partner, 0)) - amount) < 0.01)
  ))
);

