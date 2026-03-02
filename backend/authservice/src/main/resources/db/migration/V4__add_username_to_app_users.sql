-- Add username column to app_users table
ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- Set a default username for existing rows (email prefix before @)
UPDATE app_users
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Now make it NOT NULL and UNIQUE
ALTER TABLE app_users
    ALTER COLUMN username SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_app_users_username ON app_users (LOWER(username));
