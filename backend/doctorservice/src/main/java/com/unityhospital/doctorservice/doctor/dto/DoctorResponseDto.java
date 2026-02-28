package com.unityhospital.doctorservice.doctor.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class DoctorResponseDto {
    public UUID id;
    public String fullName;
    public String email;
    public String phone;
    public String speciality;
    public String slmcNo;
    public boolean isAvailable;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
