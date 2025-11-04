-- Add Credit Card Repayment category if it doesn't exist
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Credit Card Repayment', '💳', '#FF6B9D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

-- Add credit card repayment subcategories if they don't exist
-- Use a single category_id to avoid duplicates
DO $$
DECLARE
  cc_repayment_category_id UUID;
BEGIN
  -- Get the Credit Card Repayment category (should be only one after cleanup)
  SELECT id INTO cc_repayment_category_id
  FROM categories 
  WHERE name = 'Credit Card Repayment' AND user_id IS NULL
  ORDER BY created_at ASC
  LIMIT 1;

  -- Only proceed if category exists
  IF cc_repayment_category_id IS NOT NULL THEN
    -- Insert subcategories only if they don't exist
    INSERT INTO subcategories (category_id, name, icon, color)
    VALUES 
      (cc_repayment_category_id, 'Flipkart Axis Bank CC', '💳', '#FF7FA8'),
      (cc_repayment_category_id, 'Axis Bank Indian Oil CC', '💳', '#FF93B3'),
      (cc_repayment_category_id, 'Axis Bank Neo CC', '💳', '#FFA7BE'),
      (cc_repayment_category_id, 'Swiggy HDFC CC', '💳', '#FFBBC9')
    ON CONFLICT (category_id, name) DO NOTHING;
  END IF;
END $$;

