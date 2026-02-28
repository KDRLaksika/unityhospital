CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    appointment_id UUID NOT NULL,
    price_plan_id UUID NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );