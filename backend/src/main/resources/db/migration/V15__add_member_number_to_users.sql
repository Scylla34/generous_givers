-- Add member_number column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS member_number VARCHAR(20) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_member_number ON users(member_number);

-- Generate member numbers for existing users in order of creation
-- Format: GGF001, GGF002, etc.
DO $$
DECLARE
    user_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR user_record IN
        SELECT id FROM users
        WHERE member_number IS NULL
        ORDER BY created_at ASC
    LOOP
        UPDATE users
        SET member_number = 'GGF' || LPAD(counter::TEXT, 3, '0')
        WHERE id = user_record.id;
        counter := counter + 1;
    END LOOP;
END $$;
