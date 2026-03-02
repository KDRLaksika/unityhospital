-- Seed Invoices
INSERT INTO invoices (id, patient_id, appointment_id, price_plan_id, total_amount, status, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e61', gen_random_uuid(), gen_random_uuid(), 1500.00, 'PAID', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e62', gen_random_uuid(), gen_random_uuid(), 5000.00, 'PENDING', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e63', gen_random_uuid(), gen_random_uuid(), 12500.50, 'PAID', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e64', gen_random_uuid(), gen_random_uuid(), 3200.00, 'OVERDUE', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e65', gen_random_uuid(), gen_random_uuid(), 4500.00, 'PAID', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e66', gen_random_uuid(), gen_random_uuid(), 8900.00, 'PENDING', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e67', gen_random_uuid(), gen_random_uuid(), 6700.00, 'PAID', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e68', gen_random_uuid(), gen_random_uuid(), 1200.00, 'PAID', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e69', gen_random_uuid(), gen_random_uuid(), 15000.00, 'OVERDUE', true, NOW(), NOW()),
    (gen_random_uuid(), 'c3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e70', gen_random_uuid(), gen_random_uuid(), 2500.00, 'PAID', true, NOW(), NOW());
