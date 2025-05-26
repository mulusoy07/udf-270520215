
-- Complete database setup script
-- Run this script to set up all tables and test data

-- 1. Create all tables
SOURCE create_all_tables.sql;

-- 2. Insert test data
SOURCE insert_test_data.sql;

-- Verify the setup
SELECT 'Subscription Plans:' as Info;
SELECT id, name, price, currency FROM subscription_plans;

SELECT 'Active Subscriptions:' as Info;
SELECT s.id, u.email, sp.name as plan_name, s.expiry_date, s.is_active 
FROM subscriptions s 
JOIN users u ON s.user_id = u.id 
JOIN subscription_plans sp ON s.plan_id = sp.id;

SELECT 'Order History Sample:' as Info;
SELECT oh.id, u.email, sp.name as plan_name, oh.amount, oh.currency, oh.status, oh.created_at
FROM order_history oh 
JOIN users u ON oh.user_id = u.id 
JOIN subscription_plans sp ON oh.plan_id = sp.id 
ORDER BY oh.created_at DESC 
LIMIT 10;
