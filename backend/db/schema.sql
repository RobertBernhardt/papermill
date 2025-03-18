-- Create paper_requests table
CREATE TABLE IF NOT EXISTS paper_requests (
  id SERIAL PRIMARY KEY,
  paper_topic TEXT NOT NULL,
  academic_discipline VARCHAR(100) NOT NULL,
  paper_type VARCHAR(50) NOT NULL,
  creativity_level INTEGER NOT NULL,
  quality_control VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  paper_focus TEXT,
  additional_suggestions TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);