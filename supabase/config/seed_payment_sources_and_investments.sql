-- Seed payment sources
-- Credit Cards
INSERT INTO payment_sources (name, type, icon)
VALUES ('Flipkart Axis Bank CC', 'credit_card', '💳')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_sources (name, type, icon)
VALUES ('Axis Bank Indian Oil CC', 'credit_card', '💳')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_sources (name, type, icon)
VALUES ('Axis Bank Neo CC', 'credit_card', '💳')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_sources (name, type, icon)
VALUES ('Swiggy HDFC CC', 'credit_card', '💳')
ON CONFLICT (name) DO NOTHING;

-- Savings Accounts
INSERT INTO payment_sources (name, type, icon)
VALUES ('Federal Bank', 'savings_account', '🏦')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_sources (name, type, icon)
VALUES ('Axis Bank', 'savings_account', '🏦')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_sources (name, type, icon)
VALUES ('State Bank Of India', 'savings_account', '🏦')
ON CONFLICT (name) DO NOTHING;

-- Seed investment types
INSERT INTO investment_types (name, icon)
VALUES ('Emergency Fund', '🏦')
ON CONFLICT (name) DO NOTHING;

INSERT INTO investment_types (name, icon)
VALUES ('Fixed Deposit (FD)', '📋')
ON CONFLICT (name) DO NOTHING;

INSERT INTO investment_types (name, icon)
VALUES ('Recurring Deposit (RD)', '📅')
ON CONFLICT (name) DO NOTHING;

INSERT INTO investment_types (name, icon)
VALUES ('Stocks', '📈')
ON CONFLICT (name) DO NOTHING;

INSERT INTO investment_types (name, icon)
VALUES ('Crypto', '₿')
ON CONFLICT (name) DO NOTHING;

INSERT INTO investment_types (name, icon)
VALUES ('Mutual Fund SIP', '💼')
ON CONFLICT (name) DO NOTHING;

