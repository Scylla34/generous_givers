-- Add poster column to projects table for storing upload ID of project poster image
ALTER TABLE projects ADD COLUMN IF NOT EXISTS poster VARCHAR(255);
