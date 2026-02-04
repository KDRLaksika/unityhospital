ALTER TABLE password_reset_tokens
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL;
