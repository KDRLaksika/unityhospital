CREATE TABLE IF NOT EXISTS drugs (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description VARCHAR(300),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_drugs_name
    ON drugs (lower(name));

CREATE INDEX IF NOT EXISTS idx_drugs_active
    ON drugs (is_active);