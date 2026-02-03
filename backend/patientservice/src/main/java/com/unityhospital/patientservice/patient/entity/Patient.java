package com.unityhospital.patientservice.patient.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "patients")
public class Patient extends BaseEntity {

    // getters/setters
    @Setter
    @Column(nullable = false, length = 100)
    private String firstName;

    @Setter
    @Column(nullable = false, length = 100)
    private String lastName;

    @Setter
    @Column(unique = true, length = 20)
    private String nic;

    @Setter
    @Column(length = 20)
    private String phone;

    @Setter
    @Column(length = 150)
    private String email;

    @Setter
    private LocalDate dateOfBirth;

    @Setter
    @Column(length = 20)
    private String gender;

    @Setter
    @Column(columnDefinition = "TEXT")
    private String address;

    @Setter
    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientDependent> dependents = new ArrayList<>();

}
