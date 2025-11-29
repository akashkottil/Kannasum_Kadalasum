-- Migration: Add comprehensive categories and subcategories
-- This migration preserves all existing data and adds new categories

-- 1. Housing & Home
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Housing & Home', '🏠', '#FF6B6B', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Rent', '🏘️', '#FF8E8E'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Electricity Bill', '⚡', '#FFA5A5'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Water Bill', '💧', '#FFBFBF'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gas / Cylinder', '🔥', '#FFD4D4'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Maintenance & Repairs', '🔧', '#FFE0E0'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Household Supplies', '🧹', '#FFE5E0'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Furniture & Appliances', '🛋️', '#FFEFE5'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Home Improvements', '🏗️', '#FFF5EA'
FROM categories WHERE name = 'Housing & Home' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 2. Food & Groceries
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Food & Groceries', '🍽️', '#4ECDC4', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Groceries (Home Cooking)', '🛒', '#6ED5CC'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Breakfast Outside', '🍳', '#8EDCD4'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Lunch Outside', '🍱', '#AEE3DC'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Dinner Outside', '🍽️', '#CEE5E4'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Snacks & Fast Food', '🍿', '#DEE9E8'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Coffee / Tea / Beverages', '☕', '#EEEDEC'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Online Food Delivery', '📱', '#FEF5F4'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Bakery / Sweets', '🍰', '#FFF0EF'
FROM categories WHERE name = 'Food & Groceries' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 3. Transport & Commute
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Transport & Commute', '🚗', '#FFE66D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Fuel (Bike / Car)', '⛽', '#FFEC7C'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Cab / Taxi', '🚕', '#FFF08C'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Bus / Train / Metro', '🚌', '#FFF49C'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Parking / Toll', '🅿️', '#FFF8AC'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Vehicle Service & Repairs', '🔧', '#FFFABC'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Vehicle Insurance', '🛡️', '#FFFDCC'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Vehicle Accessories', '🛠️', '#FFFFDC'
FROM categories WHERE name = 'Transport & Commute' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 4. Bills & Utilities
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Bills & Utilities', '📱', '#95E1D3', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Mobile Recharge', '📲', '#A7E7DB'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Internet / WiFi', '🌐', '#B9EDE3'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'OTT Subscriptions', '🎬', '#CBEDE9'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'DTH / Cable', '📺', '#DDEDEF'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Postpaid Mobile Bill', '💳', '#EDEDF5'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Utility Fees / Penalties', '⚖️', '#FDEDFB'
FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 5. Shopping & Lifestyle
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Shopping & Lifestyle', '🛍️', '#A8D8EA', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Clothing & Footwear', '👔', '#B8E0F0'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Electronics & Gadgets', '📱', '#C8E8F6'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Online Shopping', '🛒', '#D8F0FC'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Accessories', '💍', '#E8F8FF'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Home Decor', '🖼️', '#F8F8FF'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Personal Items', '🧴', '#FEF8FF'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Luxury Purchases', '💎', '#FFF8FF'
FROM categories WHERE name = 'Shopping & Lifestyle' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 6. Health & Medical
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Health & Medical', '🏥', '#FF9F9F', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Doctor Consultation', '👨‍⚕️', '#FFAFAF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Medicines', '💊', '#FFBFBF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Hospital / Emergency', '🚑', '#FFCFCF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Diagnostic Tests', '🔬', '#FFDFDF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Health Insurance', '🛡️', '#FFEFEF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Fitness & Gym', '💪', '#FFFFEF'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Mental Wellness', '🧘', '#FFFFF5'
FROM categories WHERE name = 'Health & Medical' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 7. Entertainment & Leisure
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Entertainment & Leisure', '🎬', '#C7CEEA', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Movies & Shows', '🎥', '#D3DAF0'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Dining Out', '🍽️', '#DFE4F6'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Events & Concerts', '🎤', '#EBEEFC'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Clubbing / Parties', '🎉', '#F7F8FE'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Games / In-App Purchases', '🎮', '#FBFCFE'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Subscriptions (Spotify, Netflix, etc.)', '🎵', '#FDFEFE'
FROM categories WHERE name = 'Entertainment & Leisure' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 8. Travel & Vacations
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Travel & Vacations', '✈️', '#FFA07A', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Transport (Flight / Train / Bus)', '🚄', '#FFB095'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Hotel / Stay', '🏨', '#FFC0AF'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Trip Food & Drinks', '🍹', '#FFD0CA'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Sightseeing', '📸', '#FFE0E5'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Travel Shopping', '🛍️', '#FFF0F5'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Visa / Travel Insurance', '🛂', '#FFFFF5'
FROM categories WHERE name = 'Travel & Vacations' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 9. Loans & EMIs
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Loans & EMIs', '💳', '#FF6B9D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Personal Loan EMI', '📊', '#FF7FA8'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Bike Loan EMI', '🏍️', '#FF93B3'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Car Loan EMI', '🚗', '#FFA7BE'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Education Loan EMI', '🎓', '#FFBBC9'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Home Loan EMI', '🏠', '#FFCFD4'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Credit Line / BNPL EMI', '💸', '#FFE3DF'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Other Loans', '📋', '#FFF7EF'
FROM categories WHERE name = 'Loans & EMIs' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 10. Gifts & Relationships
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Gifts & Relationships', '🎁', '#FFD93D', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gift for Partner', '💝', '#FFE05D'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gift for Family', '👨‍👩‍👧‍👦', '#FFE77D'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Gift for Friends', '👥', '#FFEE9D'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Given to Friends', '🤝', '#FFF5BD'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Help to Family', '💙', '#FFFBDD'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Donations / Charity', '❤️', '#FFFFFD'
FROM categories WHERE name = 'Gifts & Relationships' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 11. Investments & Savings
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Investments & Savings', '📈', '#6BCF7F', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Mutual Funds', '📊', '#7DDF8F'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Stocks', '📉', '#8FEF9F'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'SIP', '💼', '#A1FFAF'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Fixed Deposit / RD', '🏦', '#B3FFBF'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Cryptocurrency', '₿', '#C5FFCF'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Retirement Fund', '💰', '#D7FFDF'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Other Investments', '💎', '#E9FFEF'
FROM categories WHERE name = 'Investments & Savings' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 12. Credit Card Repayment (SYSTEM CATEGORY)
-- Note: This category may already exist, so we use ON CONFLICT
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Credit Card Repayment', '💳', '#9B59B6', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Full Payment', '✅', '#AB69C6'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Minimum Due', '💵', '#BB79D6'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Partial Payment', '📊', '#CB89E6'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Card Specific Repayment', '💳', '#DB99F6'
FROM categories WHERE name = 'Credit Card Repayment' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 13. Personal Growth & Education
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Personal Growth & Education', '📚', '#3498DB', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Courses & Learning', '🎓', '#4499EB'
FROM categories WHERE name = 'Personal Growth & Education' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Certifications', '📜', '#54AAFB'
FROM categories WHERE name = 'Personal Growth & Education' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Books', '📖', '#64BBFB'
FROM categories WHERE name = 'Personal Growth & Education' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Work Tools & Software', '💻', '#74CCFB'
FROM categories WHERE name = 'Personal Growth & Education' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Skill Development', '🎯', '#84DDFB'
FROM categories WHERE name = 'Personal Growth & Education' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 14. Kids & Family (OPTIONAL)
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Kids & Family', '👶', '#E67E22', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'School Fees', '🏫', '#F68E32'
FROM categories WHERE name = 'Kids & Family' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Tuition / Coaching', '📝', '#FF9E42'
FROM categories WHERE name = 'Kids & Family' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Baby Care', '🍼', '#FFAE52'
FROM categories WHERE name = 'Kids & Family' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Toys & Games', '🧸', '#FFBE62'
FROM categories WHERE name = 'Kids & Family' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Family Activities', '🎪', '#FFCE72'
FROM categories WHERE name = 'Kids & Family' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

-- 15. Miscellaneous
INSERT INTO categories (name, icon, color, user_id)
VALUES ('Miscellaneous', '📦', '#95A5A6', NULL)
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Bank Charges', '🏦', '#A5B5B6'
FROM categories WHERE name = 'Miscellaneous' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Penalties & Fines', '⚖️', '#B5C5C6'
FROM categories WHERE name = 'Miscellaneous' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'One-time Expenses', '📋', '#C5D5D6'
FROM categories WHERE name = 'Miscellaneous' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO subcategories (category_id, name, icon, color)
SELECT id, 'Unknown / Uncategorized', '❓', '#D5E5E6'
FROM categories WHERE name = 'Miscellaneous' AND user_id IS NULL
ON CONFLICT (category_id, name) DO NOTHING;

