CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nic VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(150),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE TABLE IF NOT EXISTS patient_dependents (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    full_name VARCHAR(200) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    nic VARCHAR(20),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_patients_name ON patients (lower(first_name), lower(last_name));
CREATE INDEX IF NOT EXISTS idx_patient_dependents_patient_id ON patient_dependents (patient_id);
