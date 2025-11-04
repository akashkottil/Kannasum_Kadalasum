-- First, remove duplicate Credit Card Repayment categories
DO $$
DECLARE
  category_to_keep_id UUID;
  duplicate_category_id UUID;
BEGIN
  -- Get the first (oldest) Credit Card Repayment category
  SELECT id INTO category_to_keep_id
  FROM categories
  WHERE name = 'Credit Card Repayment' AND user_id IS NULL
  ORDER BY created_at ASC
  LIMIT 1;

  -- If we found a category to keep, process duplicates
  IF category_to_keep_id IS NOT NULL THEN
    -- Loop through all other duplicates
    FOR duplicate_category_id IN
      SELECT id
      FROM categories
      WHERE name = 'Credit Card Repayment' 
        AND user_id IS NULL 
        AND id != category_to_keep_id
    LOOP
      -- Reassign subcategories from duplicate to the kept category
      UPDATE subcategories
      SET category_id = category_to_keep_id
      WHERE category_id = duplicate_category_id;

      -- Delete the duplicate category
      DELETE FROM categories WHERE id = duplicate_category_id;
    END LOOP;
  END IF;
END $$;

-- Now ensure the category exists and has all subcategories
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Credit Card Repayment', '💳', '#FF6B9D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

-- Add subcategories using the single category (after cleanup)
DO $$
DECLARE
  cc_repayment_category_id UUID;
BEGIN
  -- Get the Credit Card Repayment category (should be only one now)
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

