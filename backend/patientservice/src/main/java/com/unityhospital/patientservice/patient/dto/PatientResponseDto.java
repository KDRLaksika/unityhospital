package com.unityhospital.patientservice.patient.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PatientResponseDto {
    public UUID id;
    public String firstName;
    public String lastName;
    public String nic;
    public String phone;
    public String email;
    public LocalDate dateOfBirth;
    public String gender;
    public String address;
    public boolean isActive;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public List<PatientDependentResponseDto> dependents;
}
