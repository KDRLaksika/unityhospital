package com.unityhospital.patientservice.patient.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class PatientDependentResponseDto {
    public UUID id;
    public UUID patientId;
    public String fullName;
    public String relationship;
    public String nic;
    public String phone;
    public LocalDate dateOfBirth;
    public String gender;
    public boolean isActive;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
