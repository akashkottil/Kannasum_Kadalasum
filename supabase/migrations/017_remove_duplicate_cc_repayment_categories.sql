-- Remove duplicate Credit Card Repayment categories, keeping only the oldest one
DO $$
DECLARE
  category_to_keep_id UUID;
  duplicate_category_id UUID;
BEGIN
  -- Get the first (oldest) Credit Card Repayment category to keep
  SELECT id INTO category_to_keep_id
  FROM categories
  WHERE name = 'Credit Card Repayment' AND user_id IS NULL
  ORDER BY created_at ASC
  LIMIT 1;

  -- If we found a category to keep, process and delete duplicates
  IF category_to_keep_id IS NOT NULL THEN
    -- Loop through all other duplicate categories
    FOR duplicate_category_id IN
      SELECT id
      FROM categories
      WHERE name = 'Credit Card Repayment' 
        AND user_id IS NULL 
        AND id != category_to_keep_id
    LOOP
      -- First, reassign any subcategories from duplicate to the kept category
      -- Delete any subcategories that would conflict (same name under different category)
      DELETE FROM subcategories
      WHERE category_id = duplicate_category_id
        AND name IN (
          SELECT name FROM subcategories 
          WHERE category_id = category_to_keep_id
        );
      
      -- Then reassign remaining subcategories
      UPDATE subcategories
      SET category_id = category_to_keep_id
      WHERE category_id = duplicate_category_id;

      -- Delete any expenses that reference the duplicate category (or handle them)
      -- Actually, we should reassign expenses to the kept category
      UPDATE expenses
      SET category_id = category_to_keep_id
      WHERE category_id = duplicate_category_id;

      -- Now delete the duplicate category
      DELETE FROM categories WHERE id = duplicate_category_id;
    END LOOP;
  END IF;
END $$;

