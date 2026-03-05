-- Seed Drugs / Pharmacy Inventory
INSERT INTO drugs (id, name, code, description, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Amoxicillin 500mg', 'DRUG-001', 'Antibiotic for bacterial infections', true, NOW(), NOW()),
    (gen_random_uuid(), 'Paracetamol 500mg', 'DRUG-002', 'Pain reliever and fever reducer', true, NOW(), NOW()),
    (gen_random_uuid(), 'Losartan 50mg', 'DRUG-003', 'Used to treat high blood pressure', true, NOW(), NOW()),
    (gen_random_uuid(), 'Metformin 500mg', 'DRUG-004', 'Medication for type 2 diabetes', true, NOW(), NOW()),
    (gen_random_uuid(), 'Omeprazole 20mg', 'DRUG-005', 'Treats acid reflux and ulcers', true, NOW(), NOW()),
    (gen_random_uuid(), 'Atorvastatin 20mg', 'DRUG-006', 'Lowers cholesterol', true, NOW(), NOW()),
    (gen_random_uuid(), 'Amlodipine 5mg', 'DRUG-007', 'Treats high blood pressure', true, NOW(), NOW()),
    (gen_random_uuid(), 'Azithromycin 250mg', 'DRUG-008', 'Antibiotic for various infections', true, NOW(), NOW()),
    (gen_random_uuid(), 'Cetirizine 10mg', 'DRUG-009', 'Antihistamine for allergies', true, NOW(), NOW()),
    (gen_random_uuid(), 'Ibuprofen 400mg', 'DRUG-010', 'Nonsteroidal anti-inflammatory drug', true, NOW(), NOW());
