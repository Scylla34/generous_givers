-- Create visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_date DATE NOT NULL,
    location TEXT,
    children_home_id UUID REFERENCES children_homes(id),
    notes TEXT,
    participants JSONB,
    created_by UUID REFERENCES users(id),
    photos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_visits_children_home_id ON visits(children_home_id);
CREATE INDEX idx_visits_created_by ON visits(created_by);
