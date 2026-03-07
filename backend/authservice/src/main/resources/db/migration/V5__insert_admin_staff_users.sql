-- Insert Admin User
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

-- Insert Staff User
INSERT INTO app_users (id, email, username, password_hash, role, is_active, created_at)
VALUES (
    '4be6e059-e935-46f9-aa8b-4c28f6e804f4', 
    'staff@hospital.com', 
    'staff_unity', 
    '$2a$10$Y0ktkTCkZLeUjvi52oCgouo8c0z8DL07LW52IlQ5OwWpSt0UpNTXG', 
    'STAFF', 
    true, 
    NOW()
)
ON CONFLICT (email) DO NOTHING;
