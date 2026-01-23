-- Migration to update users table structure for firstName and lastName
-- V11__update_users_table_for_first_last_name.sql

-- Add new columns
ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN last_name VARCHAR(50);

-- Migrate existing data by splitting the name column
UPDATE users 
SET 
    first_name = CASE 
        WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM 1 FOR POSITION(' ' IN name) - 1)
        ELSE name
    END,
    last_name = CASE 
        WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
        ELSE ''
    END
WHERE name IS NOT NULL;

-- Make the new columns NOT NULL after data migration
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;

-- Remove NOT NULL constraint from name column to allow null values
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';