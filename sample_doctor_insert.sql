-- Sample SQL script to insert a doctor into the PostgreSQL database.
-- Note: 'gen_random_uuid()' is available in PostgreSQL 13+ natively.
-- If using an older version, you may need to enable the 'pgcrypto' extension: 
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO doctors (
    id, 
    created_at, 
    updated_at, 
    full_name, 
    email, 
    phone, 
    speciality, 
    slmc_no, 
    is_available, 
    is_active
) VALUES (
    gen_random_uuid(),               -- Auto-generates a UUID
    CURRENT_TIMESTAMP,               -- created_at
    CURRENT_TIMESTAMP,               -- updated_at
    'Dr. Sarah Wilson',              -- full_name
    'sarah.wilson@unityhospital.com',-- email
    '+94 77 123 4567',               -- phone
    'Cardiologist',                  -- speciality
    'SLMC-4921',                     -- slmc_no
    true,                            -- is_available
    true                             -- is_active
);

-- Example for a second doctor
INSERT INTO doctors (
    id, created_at, full_name, email, phone, speciality, slmc_no, is_available, is_active
) VALUES (
    gen_random_uuid(), CURRENT_TIMESTAMP, 
    'Dr. James Perera', 'james.perera@unityhospital.com', '+94 71 987 6543', 'Neurologist', 'SLMC-8832', true, true
);
