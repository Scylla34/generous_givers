-- Add location fields to children_homes table
ALTER TABLE children_homes ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE children_homes ADD COLUMN IF NOT EXISTS town VARCHAR(100);
ALTER TABLE children_homes ADD COLUMN IF NOT EXISTS village VARCHAR(100);

-- Add location fields to visits table
ALTER TABLE visits ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE visits ADD COLUMN IF NOT EXISTS town VARCHAR(100);
ALTER TABLE visits ADD COLUMN IF NOT EXISTS village VARCHAR(100);

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_children_homes_city ON children_homes(city);
CREATE INDEX IF NOT EXISTS idx_children_homes_town ON children_homes(town);
CREATE INDEX IF NOT EXISTS idx_visits_city ON visits(city);
CREATE INDEX IF NOT EXISTS idx_visits_town ON visits(town);
