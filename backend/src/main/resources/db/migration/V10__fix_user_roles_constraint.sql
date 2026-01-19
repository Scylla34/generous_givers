-- Fix the users_role_check constraint to allow new role values
-- This migration drops the existing constraint and creates a new one with updated role values

-- Drop the existing check constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Create new check constraint with all valid role values according to the Constitution
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (
    role IN (
        'SUPER_USER',
        'CHAIRPERSON',
        'VICE_CHAIRPERSON',
        'SECRETARY_GENERAL',
        'VICE_SECRETARY',
        'TREASURER',
        'ORGANIZING_SECRETARY',
        'COMMITTEE_MEMBER'
    )
);
