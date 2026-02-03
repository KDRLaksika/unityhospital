package com.unityhospital.patientservice.patient.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class PatientDependentRequestDto {

    @NotBlank @Size(max = 200)
    public String fullName;

    @NotBlank @Size(max = 50)
    public String relationship;

    @Size(max = 20)
    public String nic;

    @Size(max = 20)
    public String phone;

    public LocalDate dateOfBirth;
    public String gender;

    public Boolean isActive;
}
