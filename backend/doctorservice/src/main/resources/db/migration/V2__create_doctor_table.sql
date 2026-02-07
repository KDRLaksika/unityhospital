CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(30) NULL,
    speciality VARCHAR(120) NOT NULL,
    slmc_no VARCHAR(60) NULL,

    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_doctors_full_name ON doctors (full_name);
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON doctors (speciality);
