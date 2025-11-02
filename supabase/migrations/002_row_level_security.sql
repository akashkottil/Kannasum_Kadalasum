-- Enable Row Level Security on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;

-- Partners policies
CREATE POLICY "Users can view their own partnerships"
  ON partners FOR SELECT
  USING (
    auth.uid() = user1_id OR
    auth.uid() = user2_id
  );

CREATE POLICY "Users can create partnerships"
  ON partners FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their partnerships"
  ON partners FOR UPDATE
  USING (
    auth.uid() = user1_id OR
    auth.uid() = user2_id
  );

-- Categories policies
CREATE POLICY "Users can view all categories in shared context"
  ON categories FOR SELECT
  USING (
    user_id IS NULL OR
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM partners
      WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
        AND status = 'active'
        AND (user1_id = categories.user_id OR user2_id = categories.user_id)
    )
  );

CREATE POLICY "Users can create categories"
  ON categories FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM partners
      WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
        AND status = 'active'
        AND (user1_id = categories.user_id OR user2_id = categories.user_id)
    )
  );

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (user_id = auth.uid());

-- Subcategories policies
CREATE POLICY "Users can view subcategories for visible categories"
  ON subcategories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM categories
      WHERE categories.id = subcategories.category_id
        AND (
          categories.user_id IS NULL OR
          categories.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM partners
            WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
              AND status = 'active'
              AND (user1_id = categories.user_id OR user2_id = categories.user_id)
          )
        )
    )
  );

CREATE POLICY "Users can create subcategories for their categories"
  ON subcategories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories
      WHERE categories.id = subcategories.category_id
        AND (
          categories.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM partners
            WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
              AND status = 'active'
              AND (user1_id = categories.user_id OR user2_id = categories.user_id)
          )
        )
    )
  );

CREATE POLICY "Users can update subcategories for their categories"
  ON subcategories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM categories
      WHERE categories.id = subcategories.category_id
        AND (
          categories.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM partners
            WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
              AND status = 'active'
              AND (user1_id = categories.user_id OR user2_id = categories.user_id)
          )
        )
    )
  );

CREATE POLICY "Users can delete subcategories for their categories"
  ON subcategories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM categories
      WHERE categories.id = subcategories.category_id
        AND (
          categories.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM partners
            WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
              AND status = 'active'
              AND (user1_id = categories.user_id OR user2_id = categories.user_id)
          )
        )
    )
  );

-- Expenses policies
CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (
    user_id = auth.uid() OR
    (
      partner_id IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM partners
        WHERE partners.id = expenses.partner_id
          AND (user1_id = auth.uid() OR user2_id = auth.uid())
          AND status = 'active'
      )
    )
  );

CREATE POLICY "Users can create expenses"
  ON expenses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (user_id = auth.uid());

-- Partner invitations policies
-- Note: We can't access auth.users table directly in RLS policies
-- Users can view invitations they sent
CREATE POLICY "Users can view invitations they sent or received"
  ON partner_invitations FOR SELECT
  USING (from_user_id = auth.uid());

-- Users can create invitations where they are the sender
CREATE POLICY "Users can create invitations"
  ON partner_invitations FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

-- Users can update invitations they sent
CREATE POLICY "Users can update invitations they sent or received"
  ON partner_invitations FOR UPDATE
  USING (from_user_id = auth.uid());

