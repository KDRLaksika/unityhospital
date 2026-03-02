-- SQL Script to Seed 10 Sample Appointments in 'appointmentdb'
-- NOTE: Please ensure you have at least 1 patient and 1 doctor in your system FIRST.
-- These UUIDs are generic placeholders. You should replace them with real IDs from your 'patients' and 'doctors' tables.

DELETE FROM appointments WHERE is_active = true; -- Clear existing if needed

INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, note, is_active, created_at)
VALUES
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d761', 'c2b07384-d9a8-4631-9a35-230cba54d762', CURRENT_DATE, '09:00:00', 'SCHEDULED', 'Routine checkup', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d763', 'c2b07384-d9a8-4631-9a35-230cba54d762', CURRENT_DATE, '09:30:00', 'CHECKED_IN', 'Fever and headache', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d764', 'c2b07384-d9a8-4631-9a35-230cba54d765', CURRENT_DATE, '10:00:00', 'SCHEDULED', 'Follow up on surgery', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d766', 'c2b07384-d9a8-4631-9a35-230cba54d765', CURRENT_DATE, '10:30:00', 'SCHEDULED', 'Vaccination', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d767', 'c2b07384-d9a8-4631-9a35-230cba54d768', CURRENT_DATE + INTERVAL '1 day', '11:00:00', 'SCHEDULED', 'Cardiology consult', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d769', 'c2b07384-d9a8-4631-9a35-230cba54d768', CURRENT_DATE + INTERVAL '1 day', '11:30:00', 'SCHEDULED', 'Blood pressure monitor', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d710', 'c2b07384-d9a8-4631-9a35-230cba54d711', CURRENT_DATE + INTERVAL '1 day', '14:00:00', 'COMPLETED', 'General physical', true, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d701', 'c2b07384-d9a8-4631-9a35-230cba54d702', CURRENT_DATE - INTERVAL '1 day', '14:30:00', 'COMPLETED', 'Orthopedic review', true, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d703', 'c2b07384-d9a8-4631-9a35-230cba54d702', CURRENT_DATE, '15:00:00', 'CANCELLED', 'Patient requested cancellation', true, NOW()),
(gen_random_uuid(), 'd3b07384-d9a8-4631-9a35-230cba54d704', 'c2b07384-d9a8-4631-9a35-230cba54d705', CURRENT_DATE, '15:30:00', 'SCHEDULED', 'Sports injury', true, NOW());
