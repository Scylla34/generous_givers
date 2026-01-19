-- Insert default super user for initial setup
-- Password: Admin@123 (hashed with BCrypt)
-- Note: This should be changed after first login
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
    'System Administrator',
    'admin@generalgivers.org',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'SUPER_USER',
    true
);
