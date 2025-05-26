
-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, currency, duration_days, features, is_popular, is_active) VALUES 
('Başlangıç', 'Bireysel kullanıcılar için ideal', 49.99, 'TL', 30, '["Aylık 5 UDF belgesi düzenleme", "Sınırlı şablonlar", "Temel imza özellikleri", "E-posta desteği", "Bulut depolama 500MB"]', FALSE, TRUE),
('Profesyonel', 'Profesyoneller ve küçük işletmeler için', 99.99, 'TL', 30, '["Aylık 25 UDF belgesi düzenleme", "Tüm şablonlara erişim", "Gelişmiş imza özellikleri", "Öncelikli destek", "Bulut depolama 5GB", "2 kullanıcı"]', TRUE, TRUE),
('Kurumsal', 'Büyük işletmeler ve kurumlar için', 249.99, 'TL', 30, '["Sınırsız UDF belgesi düzenleme", "Özel şablon oluşturma", "Tüm imza özellikleri", "7/24 destek", "Bulut depolama 50GB", "10 kullanıcı", "API erişimi", "Özel entegrasyonlar"]', FALSE, TRUE);

-- Insert sample users (only if you want to test with specific users)
INSERT INTO users (first_name, last_name, email, password) VALUES 
('Test', 'User', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Jane', 'Doe', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('John', 'Smith', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample subscriptions (assuming user IDs 1, 2, 3 exist)
INSERT INTO subscriptions (user_id, plan_id, expiry_date, is_active) VALUES 
(1, 2, DATE_ADD(NOW(), INTERVAL 25 DAY), TRUE),
(2, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), TRUE),
(3, 3, DATE_ADD(NOW(), INTERVAL 45 DAY), TRUE);

-- Insert sample order history
INSERT INTO order_history (user_id, plan_id, amount, currency, status, payment_method) VALUES 
(1, 2, 99.99, 'TL', 'completed', 'credit_card'),
(1, 1, 49.99, 'TL', 'completed', 'credit_card'),
(2, 1, 49.99, 'TL', 'completed', 'bank_transfer'),
(2, 1, 49.99, 'TL', 'completed', 'credit_card'),
(3, 3, 249.99, 'TL', 'completed', 'credit_card'),
(3, 2, 99.99, 'TL', 'completed', 'credit_card'),
(1, 2, 99.99, 'TL', 'pending', 'credit_card'),
(2, 2, 99.99, 'TL', 'failed', 'bank_transfer');

-- Update order history with realistic dates
UPDATE order_history SET created_at = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY);
UPDATE order_history SET updated_at = created_at;
