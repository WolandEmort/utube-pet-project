CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(100) NOT NULL,
                       role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
                        id VARCHAR(50) PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        channel_name VARCHAR(100) NOT NULL,
                        views INTEGER DEFAULT 0,
                        thumbnail_url VARCHAR(255) NOT NULL,
                        category VARCHAR(50) NOT NULL,
                        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE view_history (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                              video_id VARCHAR(50) REFERENCES videos(id) ON DELETE CASCADE,
                              viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE(user_id, video_id)
);