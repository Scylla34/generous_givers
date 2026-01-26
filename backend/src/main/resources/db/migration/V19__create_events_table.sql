-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    color_category VARCHAR(50) DEFAULT 'blue',
    reminder_minutes INTEGER DEFAULT 15,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_events_start_date_time ON events(start_date_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_reminder ON events(reminder_sent, start_date_time) WHERE reminder_sent = FALSE;