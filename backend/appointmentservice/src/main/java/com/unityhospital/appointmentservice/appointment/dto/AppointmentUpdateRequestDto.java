package com.unityhospital.appointmentservice.appointment.dto;

import com.unityhospital.appointmentservice.appointment.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class AppointmentUpdateRequestDto {

    @NotNull
    public UUID patientId;

    @NotNull
    public UUID doctorId;

    public UUID appointmentTypeId;

    @NotNull
    public LocalDate appointmentDate;

    @NotNull
    public LocalTime appointmentTime;

    public AppointmentStatus status; // optional
    public String note;

    public Boolean isActive; // optional
}
