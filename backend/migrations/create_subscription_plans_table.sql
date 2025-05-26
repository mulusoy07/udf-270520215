
CREATE TABLE subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TL',
    duration_days INT NOT NULL DEFAULT 30,
    features JSON,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample plans
INSERT INTO subscription_plans (name, description, price, currency, duration_days, features, is_popular, is_active) VALUES 
('Başlangıç', 'Bireysel kullanıcılar için ideal', 49.99, 'TL', 30, '["Aylık 5 UDF belgesi düzenleme", "Sınırlı şablonlar", "Temel imza özellikleri", "E-posta desteği", "Bulut depolama 500MB"]', FALSE, TRUE),
('Profesyonel', 'Profesyoneller ve küçük işletmeler için', 99.99, 'TL', 30, '["Aylık 25 UDF belgesi düzenleme", "Tüm şablonlara erişim", "Gelişmiş imza özellikleri", "Öncelikli destek", "Bulut depolama 5GB", "2 kullanıcı"]', TRUE, TRUE),
('Kurumsal', 'Büyük işletmeler ve kurumlar için', 249.99, 'TL', 30, '["Sınırsız UDF belgesi düzenleme", "Özel şablon oluşturma", "Tüm imza özellikleri", "7/24 destek", "Bulut depolama 50GB", "10 kullanıcı", "API erişimi", "Özel entegrasyonlar"]', FALSE, TRUE);
