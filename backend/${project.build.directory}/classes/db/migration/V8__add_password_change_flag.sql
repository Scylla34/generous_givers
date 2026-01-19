-- Add flag to force password change on first login
ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT false;

-- Update existing users except super admin
UPDATE users SET must_change_password = false WHERE role = 'SUPER_USER';
