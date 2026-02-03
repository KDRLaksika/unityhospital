package com.unityhospital.patientservice.patient.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "patient_dependents")
public class PatientDependent extends BaseEntity {

    // getters/setters
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false, length = 50)
    private String relationship;

    @Column(length = 20)
    private String nic;

    @Column(length = 20)
    private String phone;

    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(nullable = false)
    private boolean isActive = true;

}
