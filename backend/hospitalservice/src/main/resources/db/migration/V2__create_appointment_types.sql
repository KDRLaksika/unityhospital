CREATE TABLE IF NOT EXISTS appointment_types (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(300),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_appointment_types_name
    ON appointment_types (lower(name));