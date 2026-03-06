\c authdb;

-- Wait until the 'app_users' table exists, then insert the admin
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'app_users'
    ) THEN
        INSERT INTO app_users (id, email, username, password_hash, role, is_active, created_at)
        VALUES (
            '4a43a059-e935-46f9-aa8b-4c28f6e804f3', 
            'admin@unityhospital.com', 
            'admin_unity', 
            '$2a$12$/omNixIFmhJc91olowVdqeuc4ya7fCJtTx8Q4znmJ4xJR1j2N3p5u', 
            'ADMIN', 
            true, 
            NOW()
        )
        ON CONFLICT (email) DO NOTHING;
    END IF;
END
$$;
