-- =============================================================================
-- UNITY HOSPITAL - CONSISTENT SAMPLE DATA SCRIPT
-- Run these queries in their respective databases to ensure IDs match.
-- =============================================================================

--------------------------------------------------------------------------------
-- 1. DOCTOR SERVICE (doctordb)
--------------------------------------------------------------------------------
-- DELETE FROM doctors;

INSERT INTO doctors (id, full_name, speciality, email, phone, bio, is_available, is_active, created_at)
VALUES 
('d1111111-1111-1111-1111-111111111111', 'Dr. Kasun Perera', 'Cardiology', 'kasun@unity.com', '0771234567', 'Senior Cardiologist', true, true, NOW()),
('d2222222-2222-2222-2222-222222222222', 'Dr. Sarah Smith', 'Neurology', 'sarah@unity.com', '0772345678', 'Neurology Specialist', true, true, NOW()),
('d3333333-3333-3333-3333-333333333333', 'Dr. Sanath Abey', 'Pediatrics', 'sanath@unity.com', '0773456789', 'Consultant Pediatrician', true, true, NOW());

--------------------------------------------------------------------------------
-- 2. PATIENT SERVICE (patientdb)
--------------------------------------------------------------------------------
-- DELETE FROM patients;

INSERT INTO patients (id, first_name, last_name, nic, phone, email, date_of_birth, gender, address, is_active, created_at)
VALUES 
('p1111111-1111-1111-1111-111111111111', 'Sanath', 'Jayasuriya', '691234567V', '0711111111', 'sanath@gmail.com', '1969-06-30', 'MALE', 'Colombo, Sri Lanka', true, NOW()),
('p2222222-2222-2222-2222-222222222222', 'Kumar', 'Sangakkara', '771234568V', '0712222222', 'kumar@gmail.com', '1977-10-27', 'MALE', 'Kandy, Sri Lanka', true, NOW()),
('p3333333-3333-3333-3333-333333333333', 'Mahela', 'Jayawardene', '771234569V', '0713333333', 'mahela@gmail.com', '1977-05-27', 'MALE', 'Colombo, Sri Lanka', true, NOW());

--------------------------------------------------------------------------------
-- 3. APPOINTMENT SERVICE (appointmentdb)
--------------------------------------------------------------------------------
-- DELETE FROM appointments;

INSERT INTO appointments (id, patient_id, doctor_id, appointment_type_id, appointment_date, appointment_time, status, note, is_active, created_at)
VALUES 
(gen_random_uuid(), 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', '7bc3220a-f0f1-4f36-a197-030b42c82f07', CURRENT_DATE, '09:30:00', 'SCHEDULED', 'Regular checkup', true, NOW()),
(gen_random_uuid(), 'p2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', '7bc3220a-f0f1-4f36-a197-030b42c82f07', CURRENT_DATE, '10:30:00', 'SCHEDULED', 'Follow up', true, NOW()),
(gen_random_uuid(), 'p3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', '7bc3220a-f0f1-4f36-a197-030b42c82f07', CURRENT_DATE + 1, '14:00:00', 'SCHEDULED', 'Neurology consult', true, NOW());

--------------------------------------------------------------------------------
-- 4. BILLING SERVICE (billingservice)
--------------------------------------------------------------------------------
-- DELETE FROM invoices;

INSERT INTO invoices (id, patient_id, appointment_id, price_plan_id, total_amount, status, is_active, created_at)
VALUES 
(gen_random_uuid(), 'p1111111-1111-1111-1111-111111111111', gen_random_uuid(), gen_random_uuid(), 1500.00, 'PAID', true, NOW()),
(gen_random_uuid(), 'p2222222-2222-2222-2222-222222222222', gen_random_uuid(), gen_random_uuid(), 2500.00, 'PENDING', true, NOW());
