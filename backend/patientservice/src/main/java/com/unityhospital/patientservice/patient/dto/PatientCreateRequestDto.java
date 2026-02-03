package com.unityhospital.patientservice.patient.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public class PatientCreateRequestDto {

    @NotBlank @Size(max = 100)
    public String firstName;

    @NotBlank @Size(max = 100)
    public String lastName;

    @Size(max = 20)
    public String nic;

    @Size(max = 20)
    public String phone;

    @Email @Size(max = 150)
    public String email;

    public LocalDate dateOfBirth;

    @Size(max = 20)
    public String gender;

    public String address;

    public Boolean isActive;

    public List<PatientDependentRequestDto> dependents;
}
