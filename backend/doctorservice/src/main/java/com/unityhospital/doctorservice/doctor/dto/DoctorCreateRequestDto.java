package com.unityhospital.doctorservice.doctor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DoctorCreateRequestDto {

    @NotBlank
    @Size(max = 200)
    public String fullName;

    @Size(max = 150)
    public String email;

    @Size(max = 30)
    public String phone;

    @NotBlank
    @Size(max = 120)
    public String speciality;

    @Size(max = 60)
    public String slmcNo;

    public Boolean isAvailable; // optional (default true)
}
