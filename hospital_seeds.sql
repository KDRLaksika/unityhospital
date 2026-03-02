-- Sample data for Hospital Service appointment_types table
-- Run this against the hospitaldb database

INSERT INTO appointment_types (id, name, description, is_active, created_at) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'General Consultation', 'General outpatient consultation with a physician', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Follow-Up Visit', 'Follow-up visit after a previous consultation or procedure', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Cardiology Consultation', 'Specialist consultation for heart-related conditions', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'Neurology Consultation', 'Specialist consultation for neurological conditions', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Pediatrics Visit', 'Regular or specialist consultation for children under 18', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', 'Emergency Visit', 'Walk-in emergency consultation for urgent medical attention', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567807', 'Laboratory Test', 'Appointment for blood tests, urine tests, and other lab work', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567808', 'Radiology / Imaging', 'X-ray, MRI, CT scan, or ultrasound imaging appointment', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567809', 'Physiotherapy', 'Physical therapy and rehabilitation session', TRUE, NOW()),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567810', 'Dental Consultation', 'Dental check-up or treatment appointment', FALSE, NOW())
ON CONFLICT (id) DO NOTHING;
