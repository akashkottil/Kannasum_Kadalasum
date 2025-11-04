-- Seed default categories and subcategories

-- Food category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Food', '🍽️', '#FF6B6B', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Breakfast', '🍳', '#FF8E8E'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Lunch', '🍱', '#FFA5A5'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Dinner', '🍽️', '#FFBFBF'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Snacks', '🍿', '#FFD4D4'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Coffee', '☕', '#FFE0E0'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Tea', '🍵', '#FFE5E0'
FROM categories WHERE name = 'Food' AND user_id IS NULL;

-- Petrol category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Petrol', '⛽', '#4ECDC4', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Fuel', '🛢️', '#6ED5CC'
FROM categories WHERE name = 'Petrol' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Service', '🔧', '#8EDCD4'
FROM categories WHERE name = 'Petrol' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Accessories', '🛠️', '#AEE3DC'
FROM categories WHERE name = 'Petrol' AND user_id IS NULL;

-- Loan category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Loan', '💳', '#FFE66D', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'EMI', '📊', '#FFEC7C'
FROM categories WHERE name = 'Loan' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Interest', '💵', '#FFF08C'
FROM categories WHERE name = 'Loan' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Principal', '💰', '#FFF4A0'
FROM categories WHERE name = 'Loan' AND user_id IS NULL;

-- Given to Friends category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Given to Friends', '👥', '#95E1D3', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Loan', '💸', '#A7E7DB'
FROM categories WHERE name = 'Given to Friends' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gift', '🎁', '#B9EDE3'
FROM categories WHERE name = 'Given to Friends' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Shared Expense', '🤝', '#CBEDE9'
FROM categories WHERE name = 'Given to Friends' AND user_id IS NULL;

-- Rent category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Rent', '🏠', '#A8D8EA', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Monthly Rent', '🏘️', '#B8E0F0'
FROM categories WHERE name = 'Rent' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Utilities', '⚡', '#C8E8F6'
FROM categories WHERE name = 'Rent' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Maintenance', '🔨', '#D8F0FC'
FROM categories WHERE name = 'Rent' AND user_id IS NULL;

-- Shopping category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Shopping', '🛍️', '#FF9F9F', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Clothes', '👔', '#FFAFAF'
FROM categories WHERE name = 'Shopping' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Electronics', '📱', '#FFBFBF'
FROM categories WHERE name = 'Shopping' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gifts', '🎁', '#FFCFCF'
FROM categories WHERE name = 'Shopping' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Household', '🏠', '#FFDFDF'
FROM categories WHERE name = 'Shopping' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Groceries', '🛒', '#FFEFEF'
FROM categories WHERE name = 'Shopping' AND user_id IS NULL;

-- Recharge category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Recharge', '📱', '#C7CEEA', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Mobile', '📲', '#D3DAF0'
FROM categories WHERE name = 'Recharge' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Internet', '🌐', '#DFE4F6'
FROM categories WHERE name = 'Recharge' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'DTH', '📺', '#EBEEFC'
FROM categories WHERE name = 'Recharge' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'OTT', '🎬', '#F7F8FE'
FROM categories WHERE name = 'Recharge' AND user_id IS NULL;

-- Investments category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Investments', '📈', '#FFA07A', NULL);

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Mutual Funds', '📊', '#FFB095'
FROM categories WHERE name = 'Investments' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Crypto', '₿', '#FFC0AF'
FROM categories WHERE name = 'Investments' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Stocks', '📉', '#FFD0CA'
FROM categories WHERE name = 'Investments' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'SIPs', '💼', '#FFE0E5'
FROM categories WHERE name = 'Investments' AND user_id IS NULL;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'FD', '🏦', '#FFF0F5'
FROM categories WHERE name = 'Investments' AND user_id IS NULL;

-- Credit Card Repayment category
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Credit Card Repayment', '💳', '#FF6B9D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Flipkart Axis Bank CC', '💳', '#FF7FA8'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Axis Bank Indian Oil CC', '💳', '#FF93B3'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Axis Bank Neo CC', '💳', '#FFA7BE'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Swiggy HDFC CC', '💳', '#FFBBC9'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

