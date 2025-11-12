CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content TEXT,
    source VARCHAR(200),
    url VARCHAR(1000) UNIQUE,
    image_url VARCHAR(1000),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telegram_posted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_telegram_posted ON news(telegram_posted);
