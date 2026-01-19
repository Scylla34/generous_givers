-- Migration to update user roles according to the Generous Givers Family Constitution (Article 5.2)
-- Old roles: SUPER_USER, CHAIRMAN, SECRETARY, TREASURER, MEMBER
-- New roles: SUPER_USER, CHAIRPERSON, VICE_CHAIRPERSON, SECRETARY_GENERAL, VICE_SECRETARY, TREASURER, ORGANIZING_SECRETARY, COMMITTEE_MEMBER

-- Update existing users with old role names to new role names
UPDATE users SET role = 'CHAIRPERSON' WHERE role = 'CHAIRMAN';
UPDATE users SET role = 'SECRETARY_GENERAL' WHERE role = 'SECRETARY';
UPDATE users SET role = 'COMMITTEE_MEMBER' WHERE role = 'MEMBER';

-- Update the default value for the role column
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'COMMITTEE_MEMBER';
