CREATE TABLE IF NOT EXISTS price_plans (
                                           id UUID PRIMARY KEY,
                                           name VARCHAR(200) NOT NULL,
    appointment_type_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
    );

CREATE INDEX IF NOT EXISTS idx_price_plans_name
    ON price_plans (lower(name));

CREATE INDEX IF NOT EXISTS idx_price_plans_type
    ON price_plans (appointment_type_id);

CREATE INDEX IF NOT EXISTS idx_price_plans_active
    ON price_plans (is_active);
