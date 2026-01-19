-- Create donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_user_id UUID REFERENCES users(id),
    donor_name TEXT,
    email TEXT,
    amount NUMERIC(12,2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    method TEXT,
    status TEXT DEFAULT 'COMPLETED',
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_donations_donor_user_id ON donations(donor_user_id);
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_date ON donations(date);
CREATE INDEX idx_donations_status ON donations(status);

-- Add constraint to ensure status is valid
ALTER TABLE donations ADD CONSTRAINT chk_donation_status
    CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'));

-- Add constraint to ensure amount is positive
ALTER TABLE donations ADD CONSTRAINT chk_donation_amount_positive
    CHECK (amount > 0);
