-- Create children_homes table
CREATE TABLE children_homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    contact TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on name for searching
CREATE INDEX idx_children_homes_name ON children_homes(name);
