-- Remove duplicate Credit Card Repayment categories, keeping only one
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

