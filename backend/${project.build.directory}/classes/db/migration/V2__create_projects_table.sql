-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'DRAFT',
    target_amount NUMERIC(12,2) DEFAULT 0,
    funds_raised NUMERIC(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on status for filtering
CREATE INDEX idx_projects_status ON projects(status);

-- Create index on created_by for faster lookups
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Add constraint to ensure status is valid
ALTER TABLE projects ADD CONSTRAINT chk_project_status
    CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED'));
