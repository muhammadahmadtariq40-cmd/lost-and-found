-- Drop tables if they exist (for easy resetting during dev)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS found_items CASCADE;
DROP TABLE IF EXISTS lost_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'security')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost Items Table
CREATE TABLE lost_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date_lost DATE NOT NULL,
  location_lost VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MATCHED', 'RESOLVED', 'CLOSED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Found Items Table
CREATE TABLE found_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date_found DATE NOT NULL,
  location_found VARCHAR(255) NOT NULL,
  custody_location VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'CLAIMED', 'RESOLVED', 'CLOSED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  lost_item_id INTEGER REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id INTEGER REFERENCES found_items(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  found_item_id INTEGER REFERENCES found_items(id) ON DELETE CASCADE,
  lost_item_id INTEGER REFERENCES lost_items(id) ON DELETE CASCADE,
  proof_description TEXT NOT NULL,
  proof_image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'INFO_REQUESTED')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Mock Data (Optional, but helpful for testing the frontend)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@university.edu', '$2b$10$xyz', 'admin'); -- Note: password hash is mock here, replace in production
