CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY,

    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_type_id UUID NULL, -- reference only (from hospitalservice)

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    note TEXT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
