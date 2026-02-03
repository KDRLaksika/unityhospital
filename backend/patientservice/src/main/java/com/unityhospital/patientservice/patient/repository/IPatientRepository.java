package com.unityhospital.patientservice.patient.repository;

import com.unityhospital.patientservice.patient.entity.Patient;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface IPatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {
    Optional<Patient> findByNic(String nic);

    @Query("select count(p) > 0 from Patient p where p.nic = :nic and p.id <> :id")
    boolean existsByNicAndNotId(@Param("nic") String nic, @Param("id") UUID id);
}
