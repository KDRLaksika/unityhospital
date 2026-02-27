CREATE TABLE IF NOT EXISTS company_details (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300),
    phone VARCHAR(30),
    email VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_company_details_name
    ON company_details (lower(name));

CREATE INDEX IF NOT EXISTS idx_company_details_active
    ON company_details (is_active);