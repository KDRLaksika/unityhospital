package com.unityhospital.appointmentservice.appointment.dto;

import com.unityhospital.appointmentservice.appointment.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public class AppointmentResponseDto {
    public UUID id;

    public UUID patientId;
    public UUID doctorId;
    public UUID appointmentTypeId;

    public LocalDate appointmentDate;
    public LocalTime appointmentTime;

    public AppointmentStatus status;
    public String note;

    public boolean isActive;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
