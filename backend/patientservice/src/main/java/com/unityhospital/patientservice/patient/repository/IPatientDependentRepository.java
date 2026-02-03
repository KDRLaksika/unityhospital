package com.unityhospital.patientservice.patient.repository;

import com.unityhospital.patientservice.patient.entity.PatientDependent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IPatientDependentRepository extends JpaRepository<PatientDependent, UUID> {
    List<PatientDependent> findByPatientId(UUID patientId);
}
