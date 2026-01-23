-- Migration: V14__Add_profile_picture_to_users.sql
-- Description: Add profile_picture column to users table

ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255);

-- Add index for better performance when querying by profile picture
CREATE INDEX idx_users_profile_picture ON users(profile_picture);