package com.unityhospital.hospitalservice.masterdata.appointmenttype.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AppointmentTypeResponseDto {
    public UUID id;
    public String name;
    public String description;
    public boolean isActive;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
