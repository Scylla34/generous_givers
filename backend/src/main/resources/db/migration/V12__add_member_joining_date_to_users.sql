-- Migration to add member_joining_date column to users table
-- V12__add_member_joining_date_to_users.sql

-- Add member_joining_date column
ALTER TABLE users ADD COLUMN member_joining_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN users.member_joining_date IS 'Date when the member joined the Generous Givers Family';